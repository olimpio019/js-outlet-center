"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalProdutos: number;
  totalUsuarios: number;
  totalPedidos: number;
  receitaTotal: number;
  pedidosPendentes: number;
  produtosBaixoEstoque: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (status === 'unauthenticated') {
          router.replace('/admin/login');
          return;
        }

        if (status === 'authenticated') {
          const response = await fetch('/api/admin/check');
          if (!response.ok) {
            throw new Error('Erro ao verificar status de admin');
          }
          
          const data = await response.json();
          if (!data.admin) {
            router.replace('/admin/login');
          } else {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar admin:', error);
        setError('Erro ao verificar permissões de administrador');
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (status === 'loading' || isAdmin === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Produtos',
      value: stats?.totalProdutos || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total de Usuários',
      value: stats?.totalUsuarios || 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Total de Pedidos',
      value: stats?.totalPedidos || 0,
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      title: 'Receita Total',
      value: `R$ ${(stats?.receitaTotal || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  const alertCards = [
    {
      title: 'Pedidos Pendentes',
      value: stats?.pedidosPendentes || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
    {
      title: 'Produtos com Baixo Estoque',
      value: stats?.produtosBaixoEstoque || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-red-700 mb-4">Painel do Administrador</h1>
            <p className="text-gray-600 mb-6">
              Bem-vindo, {session?.user?.name || 'Administrador'}!
            </p>
            {/* Adicione aqui o conteúdo do painel admin */}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="text-sm text-gray-500">
            Última atualização: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-lg shadow p-6 flex items-center"
              >
                <div className={`${card.color} p-3 rounded-lg mr-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cards de Alertas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alertCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-lg shadow p-6 flex items-center"
              >
                <div className={`${card.color} p-3 rounded-lg mr-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gráficos e Tabelas (serão implementados posteriormente) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pedidos Recentes
            </h2>
            {/* Tabela de pedidos será implementada aqui */}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Produtos Mais Vendidos
            </h2>
            {/* Gráfico será implementado aqui */}
          </div>
        </div>
      </div>
    </div>
  );
} 