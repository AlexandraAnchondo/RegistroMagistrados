import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFView from './PDFView';
import '../styles/PDFModal.css';

export default function PDFModal({ data, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()} // Para evitar cerrar al hacer clic dentro
            >
                <PDFViewer width="100%" height="90%" showToolbar>
                    <PDFView data={data} />
                </PDFViewer>
                <div className="button-container">
                    <PDFDownloadLink
                        document={<PDFView data={data} />}
                        fileName="movimiento.pdf"
                        className="download-btn"
                    >
                        {({ loading }) => (loading ? 'Generando PDF...' : 'Descargar PDF')}
                    </PDFDownloadLink>
                    <button className="close-btn" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
                
            </div>
        </div>
    );
}
