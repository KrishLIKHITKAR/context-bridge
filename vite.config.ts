import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        react(),
        crx({
            manifest: {
                manifest_version: 3,
                name: 'Context Bridge',
                version: '1.0.0',
                description: 'Don\'t lose the plot. Continue your AI chats across models—with memory.',
                permissions: [
                    'storage',
                    'scripting',
                    'activeTab',
                    'clipboardWrite',
                    'contextMenus'
                ],
                host_permissions: [
                    'https://chat.openai.com/*',
                    'https://claude.ai/*',
                    'https://gemini.google.com/*'
                ],
                background: {
                    service_worker: 'src/background/background.ts'
                },
                content_scripts: [
                    {
                        matches: [
                            'https://chat.openai.com/*',
                            'https://claude.ai/*',
                            'https://gemini.google.com/*'
                        ],
                        js: ['src/content/content.ts'],
                        run_at: 'document_end'
                    }
                ],
                action: {
                    default_popup: 'src/popup/index.html'
                },
                commands: {
                    '_execute_action': {
                        suggested_key: {
                            default: 'Alt+Shift+C'
                        },
                        description: 'Open Context Bridge'
                    }
                }
            }
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup/index.html')
            }
        }
    }
})
