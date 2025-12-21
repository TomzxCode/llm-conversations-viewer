/**
 * File handler for drag & drop and zip file extraction
 */

import { parseConversations } from '../parsers.js';

export class FileHandler {
    constructor() {
        this.overlay = document.getElementById('drop-zone-overlay');
        this.fileInput = document.getElementById('file-input');
        this.uploadBtn = document.getElementById('upload-btn');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Prevent default drag behaviors on entire document
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        // Show overlay when dragging over document
        ['dragenter', 'dragover'].forEach(eventName => {
            document.body.addEventListener(eventName, () => this.showOverlay(), false);
        });

        // Hide overlay when leaving or dropping
        ['dragleave', 'drop'].forEach(eventName => {
            document.body.addEventListener(eventName, (e) => {
                // Only hide if we're leaving the document entirely
                if (eventName === 'dragleave' && e.target === document.body) {
                    this.hideOverlay();
                } else if (eventName === 'drop') {
                    this.hideOverlay();
                }
            }, false);
        });

        // Handle dropped files
        document.body.addEventListener('drop', (e) => this.handleDrop(e), false);

        // Handle upload button click
        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', () => {
                this.fileInput.click();
            });
        }

        // Handle file input change
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    this.handleFileSelect(files[0]);
                    // Reset input so same file can be selected again
                    this.fileInput.value = '';
                }
            });
        }
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    showOverlay() {
        this.overlay.classList.add('active');
    }

    hideOverlay() {
        this.overlay.classList.remove('active');
    }

    async handleDrop(e) {
        const files = e.dataTransfer.files;

        if (files.length === 0) {
            return;
        }

        await this.processFile(files[0]);
    }

    async handleFileSelect(file) {
        await this.processFile(file);
    }

    async processFile(file) {
        try {
            if (file.name.endsWith('.json')) {
                await this.handleJSONFile(file);
            } else if (file.name.endsWith('.zip')) {
                await this.handleZipFile(file);
            } else {
                this.showError('Unsupported file type. Please select a .json or .zip file.');
            }
        } catch (error) {
            this.showError(`Error processing file: ${error.message}`);
        }
    }

    async handleJSONFile(file) {
        const text = await file.text();
        const data = JSON.parse(text);
        const conversations = parseConversations(data);

        // Emit custom event with parsed conversations
        const event = new CustomEvent('conversations-loaded', {
            detail: { conversations, source: file.name }
        });
        document.dispatchEvent(event);

        this.showSuccess(`Loaded ${conversations.length} conversation(s) from ${file.name}`);
    }

    async handleZipFile(file) {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        // Look for conversations.json
        const conversationsFile = zip.file('conversations.json');

        if (!conversationsFile) {
            throw new Error('conversations.json not found in ZIP file');
        }

        const text = await conversationsFile.async('text');
        const data = JSON.parse(text);
        const conversations = parseConversations(data);

        // Emit custom event with parsed conversations
        const event = new CustomEvent('conversations-loaded', {
            detail: { conversations, source: file.name }
        });
        document.dispatchEvent(event);

        this.showSuccess(`Loaded ${conversations.length} conversation(s) from ${file.name}`);
    }

    showError(message) {
        this.showToast(message, 'danger');
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toastId = `toast-${Date.now()}`;
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.id = toastId;

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Show toast using Bootstrap
        const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 5000 });
        bsToast.show();

        // Remove from DOM after hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}
