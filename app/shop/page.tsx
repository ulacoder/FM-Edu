'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Zap, Star, Package, Frame, Award, Palette, TrendingUp } from 'lucide-react';
import { ShopItem, ShopItemCategory, StudentInventory } from '@/types';

const categoryInfo: Record<ShopItemCategory, { label: string; icon: any }> = {
  merch: { label: 'Мерч', icon: Package },
  profile_frame: { label: 'Рамки профиля', icon: Frame },
  badge: { label: 'Бейджи', icon: Award },
  avatar: { label: 'Аватары', icon: Star },
  theme: { label: 'Темы', icon: Palette },
  boost: { label: 'Бусты', icon: TrendingUp }
};

const rarityColors: Record<string, string> = {
  common: 'border-gray-400 bg-background',
  rare: 'border-blue-400 bg-blue-50',
  epic: 'border-purple-400 bg-purple-50',
  legendary: 'border-yellow-400 bg-yellow-50'
};

const rarityLabels: Record<string, string> = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный'
};

export default function ShopPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<StudentInventory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ShopItemCategory | 'all'>('all');
  const [purchaseModal, setPurchaseModal] = useState<{ item: ShopItem; show: boolean } | null>(null);
  const [shippingInfo, setShippingInfo] = useState({ address: '', city: '', phone: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'student') {
        router.push('/dashboard/teacher');
        return;
      }
      setUser(userData);
      loadShopData(userData.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const loadShopData = async (studentId: string) => {
    try {
      // Загружаем товары
      const itemsRes = await fetch('/api/shop/items');
      const itemsData = await itemsRes.json();
      setItems(itemsData.items || []);

      // Загружаем инвентарь
      const invRes = await fetch(`/api/shop/inventory?studentId=${studentId}`);
      const invData = await invRes.json();
      setInventory(invData.inventory);

      // Обновляем баллы студента
      const pointsRes = await fetch(`/api/student/points?studentId=${studentId}`);
      if (pointsRes.ok) {
        const pointsData = await pointsRes.json();
        setUser((prev: any) => ({ ...prev, totalPoints: pointsData.totalPoints }));
      }
    } catch (error) {
      console.error('Error loading shop data:', error);
    }
  };

  const handlePurchase = async (item: ShopItem) => {
    if (!user) return;

    // Проверяем хватает ли баллов
    if ((user.totalPoints || 0) < item.price) {
      alert(`Недостаточно баллов! Нужно: ${item.price}, у вас: ${user.totalPoints || 0}`);
      return;
    }

    // Если мерч - показываем форму доставки
    if (item.category === 'merch') {
      setPurchaseModal({ item, show: true });
      return;
    }

    // Для виртуальных товаров - покупаем сразу
    await completePurchase(item);
  };

  const completePurchase = async (item: ShopItem) => {
    if (!user) return;

    try {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          itemId: item.id,
          shippingInfo: item.category === 'merch' ? shippingInfo : undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Товар "${item.name}" куплен! Осталось баллов: ${data.newBalance}`);
        setUser((prev: any) => ({ ...prev, totalPoints: data.newBalance }));
        loadShopData(user.id);
        setPurchaseModal(null);
        setShippingInfo({ address: '', city: '', phone: '' });
      } else {
        alert(`❌ Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.error('Error purchasing:', error);
      alert('Ошибка при покупке');
    }
  };

  const isOwned = (itemId: string) => {
    return inventory?.ownedItems.some(item => item.itemId === itemId) || false;
  };

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Магазин</h1>
                <p className="text-muted-foreground">Потрать баллы на крутые товары!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg">
              <Zap className="w-5 h-5" />
              <span className="text-lg font-bold">{user.totalPoints || 0}</span>
              <span className="text-sm">баллов</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            Все товары
          </button>
          {Object.entries(categoryInfo).map(([key, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as ShopItemCategory)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {info.label}
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            const owned = isOwned(item.id);
            const canAfford = (user.totalPoints || 0) >= item.price;
            const outOfStock = item.stock !== undefined && item.stock <= 0;

            return (
              <div
                key={item.id}
                className={`bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow ${
                  item.rarity ? rarityColors[item.rarity] : ''
                } border-2`}
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center relative">
                  <div className="text-6xl">🎁</div>
                  {item.isLimited && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                      LIMITED
                    </div>
                  )}
                  {item.rarity && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs font-bold rounded">
                      {rarityLabels[item.rarity]}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-purple-600 font-bold">
                      <Zap className="w-4 h-4" />
                      <span>{item.price}</span>
                    </div>
                    {item.stock !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        Осталось: {item.stock}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={owned || !canAfford || outOfStock}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      owned
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : outOfStock
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : !canAfford
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {owned
                      ? '✓ Куплено'
                      : outOfStock
                      ? 'Нет в наличии'
                      : !canAfford
                      ? 'Недостаточно баллов'
                      : 'Купить'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">В этой категории пока нет товаров</p>
          </div>
        )}
      </div>

      {/* Purchase Modal (для мерча) */}
      {purchaseModal?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Информация для доставки</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Товар: <span className="font-semibold">{purchaseModal.item.name}</span>
            </p>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Адрес доставки"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Город"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => completePurchase(purchaseModal.item)}
                disabled={!shippingInfo.address || !shippingInfo.city || !shippingInfo.phone}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Подтвердить покупку
              </button>
              <button
                onClick={() => {
                  setPurchaseModal(null);
                  setShippingInfo({ address: '', city: '', phone: '' });
                }}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

