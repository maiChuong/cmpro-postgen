// keep your old textarea/copy/export functions here...

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

    // Enhanced Defensive Check: Pinpoint which specific tool failed to load.
    const requiredTools = {
        EditorJS: typeof EditorJS,
        Header: typeof Header,
        List: typeof List,
        Paragraph: typeof Paragraph
    };
    const missingTools = Object.keys(requiredTools).filter(key => requiredTools[key] === 'undefined');

    if (missingTools.length > 0) {
        const errorDetail = `The following editor components failed to load: ${missingTools.join(', ')}.`;
        console.error(`${errorDetail} This is often caused by a network issue or a browser extension (like an ad-blocker) blocking scripts from the CDN. Please check your browser's network tab for failed requests and try disabling extensions.`);
        const displayMessage = `<p style="color: red; font-weight: bold;">Error: The editor could not be loaded.<br><small>${errorDetail}</small></p>`;
        if (display) display.innerHTML = displayMessage;
        return;
    }

    const savedJSON = { blocks: initialBlocks };

    // clear current HTML
    display.innerHTML = '';
    
    // initialize Editor.js
    editors[contentType] = new EditorJS({
      holder: `${contentType}Display`,
      tools: {
        header: Header,
        list: List,
        paragraph: Paragraph
        // …add other tools here
      },
      data: savedJSON
    });

    // inject a save button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'btn btn-primary mt-2';
    saveBtn.onclick = async () => {
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

    display.appendChild(saveBtn);
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

// Using 'load' instead of 'DOMContentLoaded' to ensure all external scripts (like Editor.js from the CDN)
// are fully loaded and ready before we try to use them. This is more robust and prevents race conditions.
window.addEventListener('load', () => {
    // On the editor page, find the display area for the long-form post.
    const longPostDisplay = document.getElementById('longPostDisplay');
    if (longPostDisplay) { // This ensures the script only runs on the editor page
        let initialBlocks;

        // Check for content passed via URL parameter first.
        const urlParams = new URLSearchParams(window.location.search);
        const passedContentFromUrl = urlParams.get('content');

        if (passedContentFromUrl) {
            // Priority 1: Use content from URL parameter.
            const decodedContent = decodeURIComponent(passedContentFromUrl);
            initialBlocks = [{
                type: 'paragraph',
                data: {
                    text: decodedContent.replace(/\n/g, '<br>') // Preserve line breaks
                }
            }];
        } else {
            // Fallback to sessionStorage for cases where URL transfer might fail (e.g., very long content).
            const passedContentFromSession = sessionStorage.getItem('postgenEditorContent');

            if (passedContentFromSession) {
                // Priority 2: Use content passed from sessionStorage.
                initialBlocks = [{
                    type: 'paragraph',
                    data: {
                        text: passedContentFromSession.replace(/\n/g, '<br>')
                    }
                }];
                sessionStorage.removeItem('postgenEditorContent');
            } else if (typeof initialPageData !== 'undefined') {
            // Priority 3: Use data embedded in the page from Jekyll front matter.
            initialBlocks = initialPageData;
            } else {
            // Fallback: Start with an empty editor if no data is available.
            initialBlocks = [];
            }
        }

        // Immediately activate the editor, rather than showing static HTML and an "Edit" button.
        editContent('longPost', initialBlocks);
    }
});
