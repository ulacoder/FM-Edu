'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Award } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: 'scholarship' | 'competition' | 'internship' | 'program';
  deadline?: string;
  eligibility: string[];
  link?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const categoryNames: Record<string, string> = {
    scholarship: 'Стипендии',
    competition: 'Конкурсы',
    internship: 'Стажировки',
    program: 'Программы'
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    }
    setLoading(false);
  };

  const deleteOpportunity = async (id: string) => {
    if (!confirm('Удалить эту возможность?')) return;

    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadOpportunities();
      }
    } catch (error) {
      console.error('Failed to delete opportunity:', error);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || opp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление возможностями</h1>
          <p className="text-gray-600 mt-1">Стипендии, конкурсы, стажировки и программы</p>
        </div>
        <button
          onClick={() => {
            setEditingOpportunity(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Добавить возможность
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск возможностей..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Все категории</option>
            {Object.entries(categoryNames).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(categoryNames).map(([key, name]) => (
          <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">{name}</p>
            <p className="text-2xl font-bold text-purple-600">
              {opportunities.filter(o => o.category === key).length}
            </p>
          </div>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-gray-500">Загрузка...</div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">Возможности не найдены</div>
        ) : (
          filteredOpportunities.map(opp => (
            <div key={opp.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {opp.imageUrl && (
                <img src={opp.imageUrl} alt={opp.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    {categoryNames[opp.category]}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingOpportunity(opp);
                        setShowModal(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteOpportunity(opp.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{opp.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{opp.description}</p>

                {opp.deadline && (
                  <p className="text-sm text-gray-500 mb-2">
                    📅 Дедлайн: {new Date(opp.deadline).toLocaleDateString('ru-RU')}
                  </p>
                )}

                {opp.eligibility && opp.eligibility.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {opp.eligibility.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {item}
                      </span>
                    ))}
                    {opp.eligibility.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{opp.eligibility.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {opp.link && (
                  <a
                    href={opp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Подробнее →
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <OpportunityModal
          opportunity={editingOpportunity}
          onClose={() => {
            setShowModal(false);
            setEditingOpportunity(null);
          }}
          onSave={() => {
            setShowModal(false);
            setEditingOpportunity(null);
            loadOpportunities();
          }}
        />
      )}
    </div>
  );
}

function OpportunityModal({ opportunity, onClose, onSave }: { opportunity: Opportunity | null; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    title: opportunity?.title || '',
    description: opportunity?.description || '',
    category: opportunity?.category || 'scholarship',
    deadline: opportunity?.deadline || '',
    eligibility: opportunity?.eligibility?.join(', ') || '',
    link: opportunity?.link || '',
    imageUrl: opportunity?.imageUrl || ''
  });
  const [saving, setSaving] = useState(false);

  const categoryNames: Record<string, string> = {
    scholarship: 'Стипендии',
    competition: 'Конкурсы',
    internship: 'Стажировки',
    program: 'Программы'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        eligibility: formData.eligibility.split(',').map(s => s.trim()).filter(Boolean)
      };

      const url = opportunity ? `/api/admin/opportunities/${opportunity.id}` : '/api/admin/opportunities';
      const method = opportunity ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onSave();
      } else {
        alert('Ошибка при сохранении');
      }
    } catch (error) {
      console.error('Failed to save opportunity:', error);
      alert('Ошибка при сохранении');
    }

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {opportunity ? 'Редактировать возможность' : 'Добавить возможность'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              {Object.entries(categoryNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Требования (через запятую)
            </label>
            <input
              type="text"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="10-12 класс, Английский B2, ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Изображение URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
