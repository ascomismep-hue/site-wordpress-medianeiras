import { useRef, useState } from "react";
import { Upload, Loader2, X, Image as ImageIcon, Film, File as FileIcon, AlertCircle } from "lucide-react";
import { supabase } from "@/api/supabaseClient";

const LIMITS = {
  image: { bytes: 10 * 1024 * 1024, label: "10 MB", formats: "PNG, JPG ou WebP" },
  video: { bytes: 100 * 1024 * 1024, label: "100 MB", formats: "MP4 ou WebM" },
  file: { bytes: 20 * 1024 * 1024, label: "20 MB", formats: "PDF, DOCX, XLSX, ZIP" },
};

export default function MediaUpload({ value, onChange, kind = "image", label, hint }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dims, setDims] = useState(null);
  const limit = LIMITS[kind];

const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    
    if (file.size > limit.bytes) {
      setError(`Arquivo muito grande. Máximo permitido: ${limit.label}.`);
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      // Cria um nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${kind}s/${fileName}`; // pastas organizadas por tipo

      const { data, error: uploadError } = await supabase.storage
        .from('public') // Nome do seu bucket no Supabase
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Pega a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err) {
      console.error(err);
      setError("Falha no upload. Verifique as permissões do Storage.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onMediaLoad = (e) => {
    const el = e.currentTarget;
    const w = el.naturalWidth || el.videoWidth;
    const h = el.naturalHeight || el.videoHeight;
    if (w && h) setDims(`${w} × ${h} px`);
  };

  const accept = kind === "image" ? "image/*" : kind === "video" ? "video/*" : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt";

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-[#005a8d] mb-1">{label}</label>}

      {value ? (
        <div className="relative rounded-xl border border-[#c5a059]/30 overflow-hidden bg-[#f8f9fa]">
          {kind === "image" ? (
            <img src={value} alt="prévia" onLoad={onMediaLoad} className="w-full max-h-56 object-contain bg-black/5" />
          ) : kind === "video" ? (
            <video src={value} onLoadedMetadata={onMediaLoad} controls className="w-full max-h-56 bg-black" />
          ) : (
            <div className="flex items-center gap-3 p-4">
              <FileIcon className="w-8 h-8 text-[#005a8d]" />
              <span className="text-sm text-gray-600 truncate flex-1">{value.split("/").pop()}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => { onChange(""); setDims(null); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#e31e24] flex items-center justify-center shadow"
            title="Remover"
          >
            <X className="w-4 h-4" />
          </button>
          {dims && (
            <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              {dims}
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-[#c5a059]/40 bg-[#f8f9fa] hover:bg-[#c5a059]/5 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="w-7 h-7 text-[#005a8d] animate-spin" />
          ) : kind === "image" ? (
            <ImageIcon className="w-7 h-7 text-[#005a8d]" />
          ) : kind === "video" ? (
            <Film className="w-7 h-7 text-[#005a8d]" />
          ) : (
            <FileIcon className="w-7 h-7 text-[#005a8d]" />
          )}
          <span className="text-sm font-semibold text-[#005a8d]">
            {uploading ? "Enviando..." : `Clique para enviar ${kind === "file" ? "o arquivo" : kind === "video" ? "o vídeo" : "a imagem"}`}
          </span>
        </button>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />

      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
        <span>Formatos: {limit.formats}</span>
        <span>Tamanho máx.: {limit.label}</span>
        {hint && <span className="text-[#c5a059] font-semibold">Recomendado: {hint}</span>}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#e31e24] font-medium">
          <AlertCircle className="w-3.5 h-3.5" />{error}
        </p>
      )}
    </div>
  );
}
