/** Atomic-file transport provider for portable HiveForge plugin work envelopes. */
import { randomBytes } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { pluginWorkEnvelopeSchema, type PluginWorkEnvelope } from 'hiveforge-plugin-contract'

export interface PluginEnvelopeSink<T> {
  record(input: PluginWorkEnvelope): T
}

export interface PluginFileTransportOptions<T> {
  filename: string
  sink: PluginEnvelopeSink<T>
}

export async function writePluginEnvelope(filename: string, input: unknown): Promise<PluginWorkEnvelope> {
  const envelope = pluginWorkEnvelopeSchema.parse(input)
  await mkdir(dirname(filename), { recursive: true, mode: 0o700 })
  const temp = `${filename}.${randomBytes(6).toString('hex')}.tmp`
  try {
    await writeFile(temp, `${JSON.stringify(envelope)}\n`, { flag: 'wx', mode: 0o600 })
    await rename(temp, filename)
  } catch (error) {
    await rm(temp, { force: true })
    throw error
  }
  return envelope
}

export class PluginEnvelopeFileTransport<T> {
  private acceptedText: string | undefined
  private acceptedValue: T | undefined

  constructor(private readonly options: PluginFileTransportOptions<T>) {}

  get latest(): T | undefined {
    return this.acceptedValue
  }

  async refresh(): Promise<T | undefined> {
    let text: string
    try {
      text = await readFile(this.options.filename, 'utf8')
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return this.acceptedValue
      throw error
    }
    if (text === this.acceptedText) return this.acceptedValue
    const envelope = pluginWorkEnvelopeSchema.parse(JSON.parse(text))
    const value = this.options.sink.record(envelope)
    this.acceptedText = text
    this.acceptedValue = value
    return value
  }
}
