'use client';

import React, { useEffect, useState } from 'react';
import axe from 'axe-core';

const AccessibilityChecker = () => {
    const [url, setUrl] = useState('https://e-recht24.de');
    const [iframeContent, setIframeContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleCheckAccessibility = async () => {
        setLoading(true);
        try {
            // Direkte Anfrage an die URL über den Proxy
            const response = await fetch(`http://localhost:5001/proxy?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            
            // Alle relativen URLs in absolute URLs umwandeln
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const baseUrl = new URL(url);

            // Konvertiere alle relativen URLs zu absoluten URLs
            const convertToAbsoluteUrl = (relativeUrl: string) => {
                if (relativeUrl.startsWith('http')) {
                    return `http://localhost:5001/proxy?url=${encodeURIComponent(relativeUrl)}`;
                }
                const absoluteUrl = new URL(relativeUrl, baseUrl).href;
                return `http://localhost:5001/proxy?url=${encodeURIComponent(absoluteUrl)}`;
            };

            // Aktualisiere alle URLs im Dokument
            doc.querySelectorAll('[src], [href]').forEach((element: Element) => {
                if (element.hasAttribute('src')) {
                    const src = element.getAttribute('src');
                    if (src) element.setAttribute('src', convertToAbsoluteUrl(src));
                }
                if (element.hasAttribute('href')) {
                    const href = element.getAttribute('href');
                    if (href) element.setAttribute('href', convertToAbsoluteUrl(href));
                }
            });

            // CSS-Regeln aktualisieren
            doc.querySelectorAll('style').forEach((style) => {
                if (style.textContent) {
                    style.textContent = style.textContent.replace(
                        /url\(['"]?(.*?)['"]?\)/g,
                        (match, url) => `url('${convertToAbsoluteUrl(url)}')`
                    );
                }
            });

            // Setze den modifizierten HTML-Inhalt
            setIframeContent(doc.documentElement.outerHTML);

            // Warte auf das Laden des iframes
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Führe die Accessibility-Prüfung durch
            const iframe = document.getElementById('accessibility-iframe') as HTMLIFrameElement;
            if (iframe && iframe.contentDocument) {
                const axeResults = await axe.run(iframe.contentDocument);
                console.log('Axe Results:', axeResults);
                setResults(axeResults);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{ width: '300px', marginRight: '10px' }}
                    aria-label="URL to check"
                />
                <button 
                    onClick={handleCheckAccessibility}
                    disabled={loading}
                >
                    {loading ? 'Checking...' : 'Check Accessibility'}
                </button>
            </div>

            <iframe
                id="accessibility-iframe"
                srcDoc={iframeContent}
                style={{ width: '100%', height: '800px', border: 'none' }}
                title="Accessibility Check Result"
            />

            {results && (
                <div>
                    <h2>Accessibility Results for {url}:</h2>
                    <div>
                        <h3>Statistics</h3>
                        <p>Total Issues: {results.violations.length}</p>
                        <p>Total Elements Affected: {
                            results.violations.reduce((acc: number, violation: any) => 
                                acc + violation.nodes.length, 0)
                        }</p>
                    </div>
                    <div>
                        <h3>Violations:</h3>
                        <ul>
                            {results.violations.map((violation: any, index: number) => (
                                <li key={index}>
                                    <strong>{violation.id}</strong>
                                    <br />
                                    Impact: {violation.impact}
                                    <br />
                                    Description: {violation.help}
                                    <br />
                                    Elements affected: {violation.nodes.length}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessibilityChecker;
