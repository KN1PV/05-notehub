import { createPortal } from 'react-dom';
import css from './NoteModal.module.css'
import React, { useEffect } from 'react';
import NoteForm from '../NoteForm/NoteForm';

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NoteModal({ isOpen, onClose }: NoteModalProps) {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        }
    });

    const handleBackDropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackDropClick}
            >
            <div className={css.modal}>
                <NoteForm onCancel={onClose} />
            </div>
        </div>,
        document.body
    );
}