import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Plus, Trash2, Edit3, X, CheckCircle2, LogOut, Image as ImageIcon, Calendar } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

export default function AdminNoticias({ onLogout }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [noticiasList, setNoticiasList] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [fotoCapaUrl, setFotoCapaUrl] = useState("");

  // Configuração do Editor estilo Word (TipTap)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content: '<p>Escreva o conteúdo da notícia aqui...</p>',
  });

  useEffect(() => {
    fetchNoticias();
  }, []);

  async function fetchNoticias() {
    setLoading(true);
    const { data } = await supabase.from("noticias").select("*").order("data_publicacao", { ascending: false });
    if (data) setNoticiasList(data);
    setLoading(false);
  }

  // Upload de Imagem de Capa ou Imagem para dentro do texto
  async function handleImageUpload(e, callback) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `noticia_${Date.now()}.${fileExt}`;
    let { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);

    if (uploadError) {
      alert("Erro ao enviar imagem: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    callback(data.publicUrl);
    setUploading(false);
  }

  // Função para inserir imagem diretamente no editor de texto (corpo da notícia)
  function adicionarImagemNoTexto() {
    const url = prompt("Cole o link da imagem ou faça o upload:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!editor) return;

    const conteudoHtml = editor.getHTML();
    const dadosNoticia = {
      titulo,
      subtitulo,
      conteudo: conteudoHtml,
      foto_url: fotoCapaUrl,
      active: true,
    };

    let error;
    if (editandoId) {
      const res = await supabase.from("noticias").update(dadosNoticia).eq("id", editandoId);
      error = res.error;
    } else {
      const res = await supabase.from("noticias").insert([dadosNoticia]);
      error = res.error;
    }

    if (!error) {
      resetForm();
      fetchNoticias();
      triggerSuccess();
    } else {
      alert("Erro ao salvar notícia.");
    }
  }

  function iniciarEdicao(item) {
    setEditandoId(item.id);
    setTitulo(item.titulo || "");
    setSubtitulo(item.subtitulo || "");
    setFotoCapaUrl(item.foto_url || "");
    if (editor) {
      editor.commands.setContent(item.conteudo || "");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditandoId(null);
    setTitulo("");
    setSubtitulo("");
    setFotoCapaUrl("");
    if (editor) editor.commands.setContent("<p></p>");
  }

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente excluir esta notícia?")) {
      await supabase.from("noticias").delete().eq("id", id);
      fetchNoticias();
    }
  }

  function triggerSuccess() {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Gerenciamento de Notícias e Avisos</h1>
          <p className="text-gray-600 text-sm">Publique comunicados com editor completo estilo Word e imagens.</p>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-2xl font-bold text-sm border border-red-100">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        )}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" /> Notícia salva com sucesso!
          </div>
        )}

        {uploading && (
          <div className="bg-blue-50 text-[#005a8d] p-4 rounded-2xl flex items-center gap-2 font-medium">
            <Loader2 className="w-5 h-5 animate-spin" /> Enviando imagem...
          </div>
        )}

        {/* Formulário Estilo Word */}
        <form onSubmit={handleSave} className="bg-gray-50 p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-[#005a8d]">
              {editandoId ? "Editar Notícia" : "Criar Nova Notícia"}
            </h3>
            {editandoId && (
              <button type="button" onClick={resetForm} className="text-xs text-red-600 font-bold flex items-center gap-1 hover:underline">
                <X className="w-4 h-4" /> Cancelar Edição
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Título da Notícia</label>
              <input 
                type="text" 
                required 
                placeholder="Ex: Retiro Anual da Congregação..." 
                value={titulo} 
                onChange={e => setTitulo(e.target.value)} 
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Subtítulo / Resumo</label>
              <input 
                type="text" 
                placeholder="Breve resumo que aparece na Home..." 
                value={subtitulo} 
                onChange={e => setSubtitulo(e.target.value)} 
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Foto de Capa Principal</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => handleImageUpload(e, url => setFotoCapaUrl(url))} 
              className="text-xs text-gray-500 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-[#005a8d] file:text-white" 
            />
            {fotoCapaUrl && <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Capa carregada com sucesso</p>}
          </div>

          {/* BARRA DE FERRAMENTAS DO EDITOR (Estilo Word) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Conteúdo da Notícia (Estilo Word)</label>
            
            {editor && (
              <div className="border border-gray-300 rounded-2xl bg-white overflow-hidden shadow-xs">
                {/* Botões de Formatação */}
                <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-700">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1.5 rounded-lg border ${editor.isActive('bold') ? 'bg-[#005a8d] text-white' : 'bg-white hover:bg-gray-50'}`}
                  >
                    Negrito
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1.5 rounded-lg border ${editor.isActive('italic') ? 'bg-[#005a8d] text-white' : 'bg-white hover:bg-gray-50'}`}
                  >
                    Itálico
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1.5 rounded-lg border ${editor.isActive('heading', { level: 2 }) ? 'bg-[#005a8d] text-white' : 'bg-white hover:bg-gray-50'}`}
                  >
                    Título 2
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1.5 rounded-lg border ${editor.isActive('bulletList') ? 'bg-[#005a8d] text-white' : 'bg-white hover:bg-gray-50'}`}
                  >
                    Lista
                  </button>
                  
                  {/* Botão para inserir imagem no meio do texto */}
                  <label className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#005a8d]" /> Inserir Imagem no Texto
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => handleImageUpload(e, url => editor.chain().focus().setImage({ src: url }).run())} 
                    />
                  </label>
                </div>

                {/* Caixa de Texto Rica */}
                <EditorContent editor={editor} className="p-4 min-h-[250px] prose max-w-none focus:outline-none" />
              </div>
            )}
          </div>

          <button type="submit" className="bg-[#005a8d] hover:bg-[#004068] text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm transition-colors">
            {editandoId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-5 h-5" />} 
            {editandoId ? "Salvar Alterações da Notícia" : "Publicar Notícia"}
          </button>
        </form>

        {/* Lista de Notícias Cadastradas */}
        <div>
          <h3 className="font-bold text-lg text-[#005a8d] mb-4">Notícias Publicadas ({noticiasList.length})</h3>
          
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#005a8d]" /></div>
          ) : noticiasList.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhuma notícia cadastrada.</p>
          ) : (
            <div className="space-y-3">
              {noticiasList.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    {item.foto_url && <img src={item.foto_url} alt="" className="w-12 h-12 rounded-xl object-cover" />}
                    <div>
                      <h4 className="font-bold text-gray-800 text-base">{item.titulo}</h4>
                      <p className="text-xs text-gray-500">{item.subtitulo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => iniciarEdicao(item)} className="text-[#005a8d] hover:bg-blue-50 p-2 rounded-xl transition-colors" title="Editar">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
