// keep your old textarea/copy/export functions here...

/**
 * Displays a toast notification message.
 * Assumes a #toast element and corresponding CSS exist.
 * @param {string} message - The message to display.
 * @param {string} type - 'success' (default) or 'error' for styling.
 */
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  // If toast element doesn't exist, create and append it to the body.
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  // Add classes for styling based on type
  toast.className = 'show';
  toast.classList.toggle('error', type === 'error');

  setTimeout(() => {
    toast.className = toast.className.replace('show', '');
  }, 4000);
}
// store active Editor.js instances
const editors = {};

/**
 * Universal editContent: for 'longPost' we spin up Editor.js,
 * otherwise fall back to your textarea editor.
 * @param {string} contentType - The identifier for the content area.
 * @param {Array} initialBlocks - The initial block data for the editor.
 */
function editContent(contentType, initialBlocks = []) {
  const display = document.getElementById(`${contentType}Display`);
  if (!display) return;

  // LONG-FORM: use Editor.js
  if (contentType === 'longPost') {
    // if already in edit mode, skip
    if (editors[contentType]) return;

    // Resilient Tool Loading: Check for core and optional tools.
    const availableTools = {};
    const missingToolNames = [];

    // Check for core Editor.js library and Paragraph tool.
    if (typeof EditorJS === 'undefined' || typeof Paragraph === 'undefined') {
        const missingCore = [
            (typeof EditorJS === 'undefined' ? 'EditorJS (Core)' : null),
            (typeof Paragraph === 'undefined' ? 'Paragraph' : null)
        ].filter(Boolean).join(', ');
        const errorDetail = `The following essential editor components failed to load: ${missingCore}.`;
        console.error(`${errorDetail} This is often caused by a network issue or a browser extension (like an ad-blocker) blocking scripts from the CDN. Please check your browser's network tab for failed requests and try disabling extensions.`);
        const displayMessage = `<p style="color: red; font-weight: bold;">Error: The editor could not be loaded.<br><small>${errorDetail}</small></p>`;
        if (display) display.innerHTML = displayMessage;
        return;
    }

    // Add core tools that are guaranteed to be present.
    availableTools.paragraph = Paragraph;

    // Dynamically add optional tools if they have loaded by checking if they are defined.
    if (typeof Header !== 'undefined') {
        availableTools.header = Header;
    } else {
        missingToolNames.push('Header');
    }
    
    if (typeof List !== 'undefined') {
        availableTools.list = List;
    } else {
        missingToolNames.push('List');
    }

    if (missingToolNames.length > 0) {
        console.warn(`Editor is loading with reduced functionality. The following tools failed to load and will be unavailable: ${missingToolNames.join(', ')}. This is likely due to a network issue or an ad-blocker.`);
    }

    const savedJSON = { blocks: initialBlocks };

    // clear current HTML
    display.innerHTML = '';
    
    // initialize Editor.js
    editors[contentType] = new EditorJS({
      holder: `${contentType}Display`,
      tools: availableTools,
      data: savedJSON
    });

    // --- Editor Controls (Save, Copy, Export) ---
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'editor-controls mt-2';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.gap = '10px';
    controlsContainer.style.flexWrap = 'wrap';

    // Save Button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save & Close';
    saveBtn.className = 'btn btn-primary';
    saveBtn.onclick = async () => {
      if (!editors[contentType]) return;
      const output = await editors[contentType].save();
      
      // store JSON back to data-attribute
      display.dataset.content = JSON.stringify(output.blocks);

      // destroy editor instance
      await editors[contentType].destroy();
      delete editors[contentType];

      // render blocks back to HTML
      display.innerHTML = renderBlocksToHTML(output.blocks);

      // re-attach your Edit button
      injectEditButton(contentType);
    };

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy Text';
    copyBtn.className = 'btn btn-secondary';
    copyBtn.onclick = async () => {
        if (!editors[contentType]) return;
        const output = await editors[contentType].save();
        const plainText = renderBlocksToPlainText(output.blocks);
        navigator.clipboard.writeText(plainText).then(() => {
            showToast('Content copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy content:', err);
            showToast('Could not copy content to clipboard.', 'error');
        });
    };

    // Export to Markdown Button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export to Markdown';
    exportBtn.className = 'btn btn-secondary';
    exportBtn.onclick = async () => {
        if (!editors[contentType]) return;
        const output = await editors[contentType].save();
        const markdown = renderBlocksToMarkdown(output.blocks);
        downloadFile(markdown, 'postgen-export.md', 'text/markdown');
    };

    controlsContainer.appendChild(saveBtn);
    controlsContainer.appendChild(copyBtn);
    controlsContainer.appendChild(exportBtn);
    display.appendChild(controlsContainer);
    return;
  }

  // SHORT-FORM fallback: your existing textarea editor
  const currentContent = display.innerHTML;
  const textarea = document.createElement('textarea');
  textarea.value = currentContent;
  textarea.style.width = '100%';
  textarea.style.height = '200px';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'btn btn-primary mt-2';
  saveBtn.onclick = () => {
    display.innerHTML = textarea.value;
    display.removeChild(textarea);
    display.removeChild(saveBtn);
    injectEditButton(contentType);
  };

  display.innerHTML = '';
  display.appendChild(textarea);
  display.appendChild(saveBtn);
}

/**
 * Re-insert the “Edit” button after saving
 */
function injectEditButton(contentType) {
  const display = document.getElementById(`${contentType}Display`);
  if (!display) return;

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'btn btn-secondary mt-2';
  editBtn.onclick = () => {
    // After saving, the content is stored in the 'data-content' attribute.
    // We need to retrieve it to re-initialize the editor correctly.
    const savedContentJSON = display.dataset.content;
    let blocks = [];
    if (savedContentJSON) {
        try {
            blocks = JSON.parse(savedContentJSON);
        } catch (e) {
            console.error("Failed to parse saved content from data-content attribute:", e);
        }
    }
    editContent(contentType, blocks);
  };
  display.appendChild(editBtn);
}

/**
 * Simple renderer: convert Editor.js blocks back to HTML
 */
function renderBlocksToHTML(blocks = []) {
  return blocks.map(block => {
    switch (block.type) {
      case 'header':
        return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      case 'paragraph':
        return `<p>${block.data.text}</p>`;
      case 'list':
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const items = block.data.items.map(i => `<li>${i}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;
      default:
        return '';
    }
  }).join('');
}

/**
 * Renders Editor.js blocks to a plain text string.
 * @param {Array} blocks - The blocks data from Editor.js.
 * @returns {string} The plain text representation.
 */
function renderBlocksToPlainText(blocks = []) {
    return blocks.map(block => {
        switch (block.type) {
            case 'header':
            case 'paragraph':
                // Replace <br> tags with newlines for accurate text representation.
                return block.data.text.replace(/<br\s*\/?>/gi, '\n');
            case 'list':
                return block.data.items.join('\n');
            default:
                return '';
        }
    }).join('\n\n');
}

/**
 * Renders Editor.js blocks to a Markdown string.
 * @param {Array} blocks - The blocks data from Editor.js.
 * @returns {string} The Markdown representation.
 */
function renderBlocksToMarkdown(blocks = []) {
    return blocks.map(block => {
        switch (block.type) {
            case 'header':
                return `${'#'.repeat(block.data.level)} ${block.data.text}\n\n`;
            case 'paragraph':
                return `${block.data.text.replace(/<br\s*\/?>/gi, '\n')}\n\n`;
            case 'list':
                const prefix = block.data.style === 'ordered' ? '1.' : '-';
                return block.data.items.map(item => `${prefix} ${item}`).join('\n') + '\n\n';
            default:
                return '';
        }
    }).join('').trim();
}

/**
 * Triggers a browser download for the given content.
 * @param {string} content - The content to download.
 * @param {string} fileName - The name of the file.
 * @param {string} contentType - The MIME type of the file.
 */
function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

// Using 'load' instead of 'DOMContentLoaded' to ensure all external scripts (like Editor.js from the CDN)
// are fully loaded and ready before we try to use them. This is more robust and prevents race conditions.
window.addEventListener('load', () => { // localStorage is synchronous, so no async needed.
    // On the editor page, find the display area for the long-form post.
    const longPostDisplay = document.getElementById('longPostDisplay');
    if (longPostDisplay) { // This ensures the script only runs on the editor page
        let initialBlocks = [];
        const contentKey = 'postgenEditorContent';

        try {
            // Priority 1: Use content from localStorage.
            const passedContentFromStorage = localStorage.getItem(contentKey);

            if (passedContentFromStorage) {
                initialBlocks = [{
                    type: 'paragraph',
                    data: {
                        text: passedContentFromStorage.replace(/\n/g, '<br>') // Preserve line breaks
                    }
                }];
                // Clean up localStorage after retrieving the content to prevent it from being loaded again.
                localStorage.removeItem(contentKey);
            } else {
                // Fallback to URL parameter for backward compatibility or other edge cases.
                const urlParams = new URLSearchParams(window.location.search);
                const passedContentFromUrl = urlParams.get('content');

                if (passedContentFromUrl) {
                    const decodedContent = decodeURIComponent(passedContentFromUrl);
                    initialBlocks = [{
                        type: 'paragraph',
                        data: {
                            text: decodedContent.replace(/\n/g, '<br>')
                        }
                    }];
                } else if (typeof initialPageData !== 'undefined') {
                    // Fallback to data embedded in the page from Jekyll front matter.
                    initialBlocks = initialPageData;
                }
            }
        } catch (error) {
            console.error("Failed to load content for editor from storage:", error);
            showToast("There was an error loading the content. Please go back and try again.", 'error');
        }

        // Immediately activate the editor, rather than showing static HTML and an "Edit" button.
        editContent('longPost', initialBlocks);
    }
});
