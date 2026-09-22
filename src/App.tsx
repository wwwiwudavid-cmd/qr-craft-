import { useState, useCallback, useEffect } from 'react';
import QRCode from 'qrcode';
import { Link2, Type, Download, Sparkles, Zap, Check } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'url' | 'text'>('url');
  const [value, setValue] = useState('');
  const [fg, setFg] = useState('#0f172a');
  const [bg, setBg] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  const generate = useCallback(async () => {
    const text = value || 'https://example.com';
    const url = await QRCode.toDataURL(text, {
      width: 512,
      margin: 1,
      color: { dark: fg, light: bg },
    });
    setQrDataUrl(url);
  }, [value, fg, bg]);

  useEffect(() => { generate(); }, [generate]);

  const handleDownload = async (ext: string) => {
    await generate();
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr-code.${ext === 'jpeg' ? 'jpg' : ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(ext);
    setTimeout(() => setDownloading(null), 1500);
  };

  const formats = [
    { label: 'PNG', ext: 'png' },
    { label: 'JPG', ext: 'jpeg' },
    { label: 'PDF', ext: 'pdf' },
    { label: 'WebP', ext: 'webp' },
  ];

  return (
    <div className="min-h-screen bg-[#0b1018] text-slate-100 font-['DM_Sans'] selection:bg-violet-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[80vw] h-[80vw] rounded-full bg-cyan-600/20 blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <header className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Generate & Export QR Codes Instantly</span>
          </div>
          <h1 className="font-['Outfit'] text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Craft Your <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">QR Code</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Enter a link or any text, customize colors, and download instantly.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <h2 className="font-['Outfit'] text-xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-5 h-5 text-violet-400" /> Content
              </h2>
              <div className="flex rounded-2xl bg-white/5 p-1 mb-6">
                <button onClick={() => setMode('url')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'url' ? 'bg-white/10 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                  <Link2 className="w-4 h-4" /> URL
                </button>
                <button onClick={() => setMode('text')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'text' ? 'bg-white/10 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                  <Type className="w-4 h-4" /> Text
                </button>
              </div>
              <label htmlFor="input" className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">{mode === 'url' ? 'Website URL' : 'Custom Text'}</label>
              <input id="input" type="text" value={value} onChange={e => setValue(e.target.value)} placeholder={mode === 'url' ? 'https://example.com' : 'Hello world!'} className="w-full bg-white/[0.06] border border-white/10 rounded-2xl px-5 py-4 text-base outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all placeholder:text-slate-600" />
              <p className="text-xs text-slate-500 mt-3">Leave empty to generate a demo QR.</p>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <h2 className="font-['Outfit'] text-xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400" /> Style
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Foreground</label>
                  <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="w-full h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer p-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Background</label>
                  <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer p-1" />
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-7">
            <div className="bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-black/30 backdrop-blur-xl flex flex-col items-center">
              <img src={qrDataUrl || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E'} alt="QR Code" className="w-72 h-72 rounded-3xl shadow-[0_0_60px_-12px_rgba(139,92,246,0.3)] border border-white/10 bg-white object-contain p-4" />

              <div className="mt-10 w-full max-w-md">
                <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" /> Download
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formats.map(f => (
                    <button key={f.ext} onClick={() => handleDownload(f.ext)} className="relative px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-400/60 hover:bg-white/10 transition-all text-sm font-semibold flex items-center justify-center gap-2 group">
                      <span className="uppercase tracking-wide">.{f.ext}</span>
                      {downloading === f.ext && <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-violet-600/90 text-white text-xs"><Check className="w-4 h-4" /> Done</span>}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">If download doesn't start, long-press the image above and choose "Save Image".</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
