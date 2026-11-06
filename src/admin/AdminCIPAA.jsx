import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { 
  Loader2, Download, Users, BarChart3, PlusCircle, Trash2, 
  UserCheck, CheckCircle2, AlertCircle, FileText 
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminCIPAA({ onLogout }) {
  const [candidatos, setCandidatos] = useState([]);
  const [votos, setVotos] = useState([]);
  const [eleitores, setEleitores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cadastrandoEleitor, setCadastrandoEleitor] = useState(false);

  // Form de cadastro de novo candidato
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [fotoFile, setFotoFile] = useState(null);

  // Form de cadastro de novo eleitor votante
  const [nomeEleitor, setNomeEleitor] = useState("");
  const [matriculaEleitor, setMatriculaEleitor] = useState("");

  const carregarDados = async () => {
    setLoading(true);
    const { data: candData } = await supabase.from("cipaa_candidatos").select("*");
    const { data: votoData } = await supabase.from("cipaa_votos").select("*");
    const { data: eleitorData } = await supabase.from("cipaa_eleitores_aptos").select("*").order("nome");

    setCandidatos(candData || []);
    setVotos(votoData || []);
    setEleitores(eleitorData || []);
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Cadastrar Candidato
  const handleCadastrarCandidato = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fotoUrl = "";

      if (fotoFile) {
        const fileExt = fotoFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
