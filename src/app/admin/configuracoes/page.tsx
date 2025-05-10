'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Configuracoes {
  nomeLoja: string;
  emailContato: string;
  telefoneContato: string;
  enderecoLoja: string;
  chavePix: string;
  taxaEntrega: number;
  prazoEntrega: number;
  horarioFuncionamento: string;
}

export default function ConfiguracoesPage() {
  const [configuracoes, setConfiguracoes] = useState<Configuracoes>({
    nomeLoja: '',
    emailContato: '',
    telefoneContato: '',
    enderecoLoja: '',
    chavePix: '',
    taxaEntrega: 0,
    prazoEntrega: 0,
    horarioFuncionamento: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    try {
      const response = await fetch('/api/admin/configuracoes');
      const data = await response.json();
      if (data) {
        setConfiguracoes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/configuracoes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuracoes),
      });

      if (response.ok) {
        toast.success('Configurações salvas com sucesso!');
      } else {
        toast.error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfiguracoes(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações da Loja</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nomeLoja" className="block text-sm font-medium text-gray-700">
              Nome da Loja
            </label>
            <input
              type="text"
              id="nomeLoja"
              name="nomeLoja"
              value={configuracoes.nomeLoja}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="emailContato" className="block text-sm font-medium text-gray-700">
              Email de Contato
            </label>
            <input
              type="email"
              id="emailContato"
              name="emailContato"
              value={configuracoes.emailContato}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="telefoneContato" className="block text-sm font-medium text-gray-700">
              Telefone de Contato
            </label>
            <input
              type="text"
              id="telefoneContato"
              name="telefoneContato"
              value={configuracoes.telefoneContato}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="chavePix" className="block text-sm font-medium text-gray-700">
              Chave PIX
            </label>
            <input
              type="text"
              id="chavePix"
              name="chavePix"
              value={configuracoes.chavePix}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="taxaEntrega" className="block text-sm font-medium text-gray-700">
              Taxa de Entrega (R$)
            </label>
            <input
              type="number"
              id="taxaEntrega"
              name="taxaEntrega"
              value={configuracoes.taxaEntrega}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="prazoEntrega" className="block text-sm font-medium text-gray-700">
              Prazo de Entrega (dias)
            </label>
            <input
              type="number"
              id="prazoEntrega"
              name="prazoEntrega"
              value={configuracoes.prazoEntrega}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="enderecoLoja" className="block text-sm font-medium text-gray-700">
            Endereço da Loja
          </label>
          <textarea
            id="enderecoLoja"
            name="enderecoLoja"
            value={configuracoes.enderecoLoja}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="horarioFuncionamento" className="block text-sm font-medium text-gray-700">
            Horário de Funcionamento
          </label>
          <textarea
            id="horarioFuncionamento"
            name="horarioFuncionamento"
            value={configuracoes.horarioFuncionamento}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
} 