import { useState } from 'react'
import './App.css'
import { testDatabase } from '../db/test'
import { dbUtils } from '../db/helpers'

function App() {
    const [status, setStatus] = useState<string>('Ready')
    const [isLoading, setIsLoading] = useState(false)

    const handleContinueIn = async (provider: string) => {
        setIsLoading(true)
        setStatus(`Preparing capsule for ${provider}...`)

        try {
            // Get selection from active tab
            const response = await chrome.runtime.sendMessage({ action: 'get-selection' });

            if (response?.selection) {
                // For now, just copy the selection as a basic capsule
                await navigator.clipboard.writeText(`[Context Bridge Capsule]\n\n${response.selection}`);
                setStatus(`Capsule copied! Opening ${provider}...`);

                // Open the provider in a new tab
                let url = '';
                switch (provider) {
                    case 'GPT':
                        url = 'https://chat.openai.com/';
                        break;
                    case 'Claude':
                        url = 'https://claude.ai/';
                        break;
                    case 'Gemini':
                        url = 'https://gemini.google.com/';
                        break;
                }

                if (url) {
                    chrome.tabs.create({ url });
                    // Insert overlay on the new tab
                    setTimeout(() => {
                        chrome.tabs.query({ url: url + '*' }, (tabs) => {
                            if (tabs[0]?.id) {
                                chrome.scripting.executeScript({
                                    target: { tabId: tabs[0].id },
                                    func: () => {
                                        if ((window as any).contextBridge) {
                                            (window as any).contextBridge.insertOverlay();
                                        }
                                    }
                                });
                            }
                        });
                    }, 2000);
                }
            } else {
                setStatus('No text selected. Please select text first.');
            }
        } catch (error: any) {
            setStatus('Error: ' + (error?.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }

    const handleSummarizeSelection = async () => {
        setIsLoading(true)
        setStatus('Summarizing selection...')

        try {
            const response = await chrome.runtime.sendMessage({ action: 'get-selection' });

            if (response?.selection) {
                // For now, create a simple summary
                const summary = `[Summary]\n${response.selection.substring(0, 200)}${response.selection.length > 200 ? '...' : ''}`;
                await navigator.clipboard.writeText(summary);
                setStatus('Summary copied to clipboard!');
            } else {
                setStatus('No text selected. Please select text first.');
            }
        } catch (error: any) {
            setStatus('Error: ' + (error?.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }

    const handleCatchMeUp = async () => {
        setIsLoading(true)
        setStatus('Building digest...')

        try {
            const response = await chrome.runtime.sendMessage({ action: 'get-selection' });

            if (response?.selection) {
                // For now, create a simple digest
                const digest = `[Catch Me Up]\n\nContext: ${response.selection.substring(0, 150)}...\n\nPending Tasks:\n- Review the conversation above\n- Continue with next steps\n\nKey Decisions:\n- Based on the selected context`;
                setStatus('Digest ready!');

                // Show digest in a modal (simplified for now)
                alert(digest);
            } else {
                setStatus('No text selected. Please select text first.');
            }
        } catch (error: any) {
            setStatus('Error: ' + (error?.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }

    const handleCleanupMode = async () => {
        setIsLoading(true)
        setStatus('Creating cleanup capsule...')

        try {
            const response = await chrome.runtime.sendMessage({ action: 'get-selection' });

            if (response?.selection) {
                // For now, create a simple cleanup capsule
                const cleanup = `[Cleanup Mode]\n\nConstraints:\n- Based on selected context\n\nDecisions:\n- Key points from conversation\n\nOpen Loops:\n- Next steps to address`;
                await navigator.clipboard.writeText(cleanup);
                setStatus('Cleanup capsule copied!');
            } else {
                setStatus('No text selected. Please select text first.');
            }
        } catch (error: any) {
            setStatus('Error: ' + (error?.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }

    const handleTestDatabase = async () => {
        setIsLoading(true)
        setStatus('Testing database...')

        try {
            const result = await testDatabase()
            if (result.success) {
                setStatus(`Database test passed! ${result.stats?.total || 0} records created.`)
            } else {
                setStatus(`Database test failed: ${result.error}`)
            }
        } catch (error: any) {
            setStatus('Error: ' + (error?.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }

    const handleViewStats = async () => {
        setIsLoading(true)
        setStatus('Loading database stats...')

        try {
            const stats = await dbUtils.getStats()
            setStatus(`DB Stats: ${stats.total} total (${stats.capsules} capsules, ${stats.projects} projects, ${stats.sessions} sessions, ${stats.artifacts} artifacts)`)
        } catch (error: any) {
            setStatus('Error: ' + (error?.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>Context Bridge</h1>
                <p className="tagline">Don't lose the plot. Continue your AI chats across models—with memory.</p>
            </header>

            <main className="app-main">
                <div className="status-bar">
                    <span className={`status ${isLoading ? 'loading' : ''}`}>
                        {status}
                    </span>
                </div>

                <div className="button-grid">
                    <button
                        className="action-button primary"
                        onClick={() => handleContinueIn('GPT')}
                        disabled={isLoading}
                    >
                        Continue in GPT
                    </button>

                    <button
                        className="action-button primary"
                        onClick={() => handleContinueIn('Claude')}
                        disabled={isLoading}
                    >
                        Continue in Claude
                    </button>

                    <button
                        className="action-button primary"
                        onClick={() => handleContinueIn('Gemini')}
                        disabled={isLoading}
                    >
                        Continue in Gemini
                    </button>

                    <button
                        className="action-button secondary"
                        onClick={handleSummarizeSelection}
                        disabled={isLoading}
                    >
                        Summarize Selection
                    </button>

                    <button
                        className="action-button secondary"
                        onClick={handleCatchMeUp}
                        disabled={isLoading}
                    >
                        Catch Me Up
                    </button>

                    <button
                        className="action-button secondary"
                        onClick={handleCleanupMode}
                        disabled={isLoading}
                    >
                        Cleanup Mode
                    </button>

                    <button
                        className="action-button secondary"
                        onClick={handleTestDatabase}
                        disabled={isLoading}
                    >
                        Test Database
                    </button>

                    <button
                        className="action-button secondary"
                        onClick={handleViewStats}
                        disabled={isLoading}
                    >
                        View DB Stats
                    </button>
                </div>

                <div className="instructions">
                    <p><strong>How to use:</strong></p>
                    <ol>
                        <li>Select text in any AI chat</li>
                        <li>Click one of the buttons above</li>
                        <li>For "Continue in...", paste the capsule in the new tab</li>
                    </ol>
                </div>
            </main>
        </div>
    )
}

export default App
