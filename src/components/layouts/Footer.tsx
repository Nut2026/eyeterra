import React from 'react';

const Footer: React.FC = () => (
  <footer className="border-t-2 border-border bg-background mt-auto">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">

        <span className="text-muted-foreground text-sm">— Protecting vision shouldn't be just a vision</span>
      </div>
      <p className="text-xs text-muted-foreground text-balance text-center hc-footer-exempt">{"Made with 🧡 by Nuz"}</p>
    </div>
  </footer>
);

export default Footer;
