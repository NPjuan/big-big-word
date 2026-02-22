/**
 * AI Provider configuration interface.
 * Implement this interface to add a new AI provider (e.g., Coze, ChatGPT, Gemini).
 */
export interface AiProvider {
  /** Unique identifier for the provider */
  id: string
  /** Display name shown in the UI */
  name: string
  /** Short description of the provider */
  description: string
  /** Icon name (mdi icon) or SVG path */
  icon: string
  /** The type of integration */
  type: 'iframe' | 'api'
  /** For iframe providers: the embed URL */
  iframeUrl?: string
  /** For iframe providers: optional sandbox attributes */
  iframeSandbox?: string
  /** For iframe providers: optional allow attributes */
  iframeAllow?: string
  /** Whether this provider is currently active/available */
  enabled: boolean
}

/**
 * AI Drawer state interface
 */
export interface AiDrawerState {
  /** Whether the drawer is open */
  isOpen: boolean
  /** Currently selected AI provider */
  currentProvider: AiProvider | null
  /** Width of the drawer in pixels */
  width: number
}
