# Context Bridge

**Don't lose the plot. Continue your AI chats across models—with memory.**

A Chrome extension that creates portable, token-efficient context capsules to continue AI chats across GPT, Claude, and Gemini with local-first storage and zero server requirements.

## Features (MVP)

- **Cross-AI Continuity**: Continue conversations across different AI models in 2-3 clicks
- **Selective Summarization**: Summarize exactly the relevant portion of conversations
- **Catch Me Up**: Get a digest of context and pending tasks
- **Cleanup Mode**: Create minimal capsules with just constraints and decisions
- **Local-First Storage**: All data stays in your browser (IndexedDB)
- **Privacy-First**: No server, no login, no data sent to third parties

## Development Status

**Milestone 0 - Scaffold** ✅ COMPLETED
- Basic Chrome extension structure with Vite + TypeScript + React
- MV3 manifest with minimal permissions
- Popup UI with 4 main action buttons
- Background service worker and content scripts

**Milestone 1 - Local DB + Types** ✅ COMPLETED
- Comprehensive TypeScript types with Zod validation
- Dexie database setup with IndexedDB storage
- Database helper functions for CRUD operations
- Support for Capsules, Projects, Sessions, and Artifacts
- Local-first storage with export/import functionality

**Next Milestones:**
- Milestone 2: Token Estimation + Extractors  
- Milestone 3: Segmentation + Micro-Summaries + Prioritization
- Milestone 4: Provider Adapters/Sanitizers
- Milestone 5: Popup UI + Actions (enhanced)
- Milestone 6: Content Scripts (Handoff UX)
- Milestone 7: Context Menus + Hotkeys
- Milestone 8: Project Memory + Timeline
- Milestone 9: Build, QA, and Packaging

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

### Load Extension in Chrome
1. Build the project: `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder
5. The Context Bridge extension should now appear in your extensions list

## Usage

1. **Select text** in any AI chat (ChatGPT, Claude, Gemini)
2. **Click the Context Bridge extension icon** in your toolbar
3. **Choose an action**:
   - **Continue in...**: Opens the selected AI model with a context capsule
   - **Summarize Selection**: Creates a summary capsule and copies to clipboard
   - **Catch Me Up**: Shows a digest of context and pending tasks
   - **Cleanup Mode**: Creates a minimal capsule with key constraints/decisions

## Architecture

- **Popup**: React-based UI for user interactions
- **Background**: Service worker for extension lifecycle and messaging
- **Content Scripts**: Run on AI chat pages for overlay and input handling
- **Engine**: Core logic for context extraction, summarization, and capsule building
- **Database**: Local storage using IndexedDB (Dexie.js)

## Permissions

- `storage`: For local data storage
- `scripting`: To execute scripts in tabs
- `activeTab`: To access the current tab
- `clipboardWrite`: To copy capsules to clipboard
- `contextMenus`: For right-click context menu integration

## Privacy & Security

- **Local-First**: All data stored locally in your browser
- **No Server**: Zero external dependencies or data transmission
- **User-Initiated**: Only captures data when you explicitly select text
- **ToS-Friendly**: No automated scraping or simulated user actions

## Contributing

This is a work in progress. The extension is being built milestone by milestone with a focus on:

1. **Minimal viable product** with core continuity features
2. **Privacy-first** approach with local storage
3. **User experience** that's intuitive and fast
4. **Extensibility** for future AI model support

## License

MIT License - see LICENSE file for details.
