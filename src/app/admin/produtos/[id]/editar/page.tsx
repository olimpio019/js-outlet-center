"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagemUrl: string;
  descricao: string;
  estoque: number;
  categoriaId: number;
  categoria: {
    id: number;
    nome: string;
  };
}

interface Categoria {
  id: number;
  nome: string;
}

export default function EditarProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [produto, setProduto] = useState<Produto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    imagemUrl: '',
    descricao: '',
    estoque: '',
    categoriaId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Iniciando busca de dados...');
        
        const [produtoResponse, categoriasResponse] = await Promise.all([
          fetch(`/api/admin/produtos/${params.id}`),
          fetch('/api/admin/categorias'),
        ]);

        console.log('Resposta do produto:', produtoResponse.status);
        console.log('Resposta das categorias:', categoriasResponse.status);

        if (!produtoResponse.ok) {
          const errorData = await produtoResponse.json();
          throw new Error(errorData.error || 'Erro ao carregar produto');
        }

        if (!categoriasResponse.ok) {
          const errorData = await categoriasResponse.json();
          throw new Error(errorData.error || 'Erro ao carregar categorias');
        }

        const [produtoData, categoriasData] = await Promise.all([
          produtoResponse.json(),
          categoriasResponse.json(),
        ]);

        console.log('Dados do produto:', produtoData);
        console.log('Dados das categorias:', categoriasData);

        setProduto(produtoData);
        setCategorias(categoriasData);
        setFormData({
          nome: produtoData.nome,
          preco: produtoData.preco.toString(),
          imagemUrl: produtoData.imagemUrl,
          descricao: produtoData.descricao,
          estoque: produtoData.estoque.toString(),
          categoriaId: produtoData.categoriaId.toString(),
        });
      } catch (err) {
        console.error('Erro detalhado:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        toast.error('Erro ao carregar dados do produto');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/produtos/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          preco: parseFloat(formData.preco),
          imagemUrl: formData.imagemUrl,
          descricao: formData.descricao,
          estoque: parseInt(formData.estoque),
          categoriaId: parseInt(formData.categoriaId),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }

      toast.success('Produto atualizado com sucesso!');
      router.push('/admin/produtos');
    } catch (err) {
      toast.error('Erro ao atualizar produto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-red-500">{error || 'Produto não encontrado'}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Editar Produto</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL da Imagem
          </label>
          <input
            type="url"
            value={formData.imagemUrl}
            onChange={(e) => setFormData({ ...formData, imagemUrl: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estoque
          </label>
          <input
            type="number"
            value={formData.estoque}
            onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            value={formData.categoriaId}
            onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
} 