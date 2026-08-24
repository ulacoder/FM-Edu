"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Search,
  Filter,
  MapPin,
  Clock,
  Bookmark,
  Trophy,
  Target,
  Award,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { getActiveUniversityAds, initializeUniversityAds } from '@/lib/university-ads';
import { UniversityAd } from '@/types/university-ad';

const categories = ["Все", "Олимпиада", "Конкурс", "Стипендия", "Летняя программа", "Хакатон", "Конференция", "Исследовательская программа"];
const fields = ["Все", "STEM", "Бизнес", "IT", "Программирование", "Социальное влияние", "Наука", "Математика", "Физика"];
const grades = ["Все", "7 класс", "8 класс", "9 класс", "10 класс", "11 класс", "12 класс"];
const costs = ["Все", "Бесплатно", "Платно"];

// Моковые данные возможностей
const opportunities = [
  {
    id: 1,
    title: "Международная олимпиада по математике",
    description: "Престижная олимпиада для школьников 9-11 классов. Победители получают дипломы и гранты на обучение.",
    category: "Олимпиада",
    tags: ["Математика", "STEM"],
    grade: ["9 класс", "10 класс", "11 класс"],
    location: "Онлайн",
    deadline: "2026-10-15",
    cost: "Бесплатно",
    keywords: ["математика", "олимпиада", "международная"]
  },
  {
    id: 2,
    title: "Хакатон Code for Future",
    description: "48-часовой хакатон для школьников. Создавай проекты, решающие реальные проблемы. Призовой фонд 500,000 тг.",
    category: "Хакатон",
    tags: ["IT", "Программирование"],
    grade: ["10 класс", "11 класс", "12 класс"],
    location: "Алматы",
    deadline: "2026-09-20",
    cost: "Бесплатно",
    keywords: ["программирование", "хакатон", "it"]
  },
  {
    id: 3,
    title: "Стипендия Болашак для школьников",
    description: "Программа поддержки талантливых школьников. Покрывает обучение в топовых университетах мира.",
    category: "Стипендия",
    tags: ["Стипендия"],
    grade: ["11 класс", "12 класс"],
    location: "Международная",
    deadline: "2026-11-30",
    cost: "Бесплатно",
    keywords: ["стипендия", "обучение", "грант"]
  },
  {
    id: 4,
    title: "Летняя школа STEM в MIT",
    description: "Двухнедельная программа в MIT для школьников. Лекции, лабораторные работы и проекты с профессорами.",
    category: "Летняя программа",
    tags: ["STEM", "Наука"],
    grade: ["10 класс", "11 класс"],
    location: "США, Бостон",
    deadline: "2026-12-01",
    cost: "Платно (стипендии доступны)",
    keywords: ["летняя школа", "mit", "наука"]
  },
  {
    id: 5,
    title: "Конкурс научных проектов Junior Scientist",
    description: "Представь свой исследовательский проект. Победители получают гранты на дальнейшие исследования.",
    category: "Конкурс",
    tags: ["Наука", "STEM"],
    grade: ["8 класс", "9 класс", "10 класс", "11 класс"],
    location: "Астана",
    deadline: "2026-10-30",
    cost: "Бесплатно",
    keywords: ["наука", "исследования", "проект"]
  },
  {
    id: 6,
    title: "Олимпиада по физике Satbayev University",
    description: "Республиканская олимпиада по физике. Призеры получают льготы при поступлении.",
    category: "Олимпиада",
    tags: ["Физика", "STEM"],
    grade: ["10 класс", "11 класс", "12 класс"],
    location: "Алматы",
    deadline: "2026-09-30",
    cost: "Бесплатно",
    keywords: ["физика", "олимпиада"]
  },
  {
    id: 7,
    title: "Конференция Young Leaders Summit",
    description: "Конференция для будущих лидеров. Networking, воркшопы и менторство от успешных предпринимателей.",
    category: "Конференция",
    tags: ["Бизнес", "Социальное влияние"],
    grade: ["9 класс", "10 класс", "11 класс", "12 класс"],
    location: "Шымкент",
    deadline: "2026-11-15",
    cost: "Платно (10,000 тг)",
    keywords: ["лидерство", "бизнес", "конференция"]
  },
  {
    id: 8,
    title: "Исследовательская программа в КазНУ",
    description: "Летняя исследовательская программа для школьников. Работа в лабораториях университета с учеными.",
    category: "Исследовательская программа",
    tags: ["Наука", "STEM"],
    grade: ["10 класс", "11 класс"],
    location: "Алматы",
    deadline: "2026-12-20",
    cost: "Бесплатно",
    keywords: ["исследования", "университет", "лаборатория"]
  }
];

export default function OpportunitiesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedField, setSelectedField] = useState("Все");
  const [selectedGrade, setSelectedGrade] = useState("Все");
  const [selectedCost, setSelectedCost] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [universityAds, setUniversityAds] = useState<UniversityAd[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));

    // Load saved opportunities
    const saved = localStorage.getItem(`saved_opportunities_${JSON.parse(userStr).id}`);
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }

    // Load university ads
    initializeUniversityAds();
    const ads = getActiveUniversityAds();
    setUniversityAds(ads);
  }, [router]);

  if (!user) return null;

  const handleSave = (id: number) => {
    let newSaved: number[];
    if (savedItems.includes(id)) {
      newSaved = savedItems.filter(item => item !== id);
    } else {
      newSaved = [...savedItems, id];
    }
    setSavedItems(newSaved);
    localStorage.setItem(`saved_opportunities_${user.id}`, JSON.stringify(newSaved));
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesCategory = selectedCategory === "Все" || opp.category === selectedCategory;
    const matchesField = selectedField === "Все" || opp.tags.includes(selectedField);
    const matchesGrade = selectedGrade === "Все" || opp.grade.includes(selectedGrade);
    const matchesCost = selectedCost === "Все" ||
      (selectedCost === "Бесплатно" && opp.cost === "Бесплатно") ||
      (selectedCost === "Платно" && opp.cost.includes("Платно"));
    const matchesSearch = searchQuery === "" ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesField && matchesGrade && matchesCost && matchesSearch;
  });

  const getDeadlineColor = (deadline: string) => {
    const daysLeft = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7) return "bg-red-500/10 text-red-600 border-red-500/30";
    if (daysLeft <= 30) return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30";
    return "bg-green-500/10 text-green-600 border-green-500/30";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero */}
      <div className="border-b border-border/40 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-10 h-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              Каталог возможностей
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Находи олимпиады, конкурсы, стипендии и программы для своего развития
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Grid: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content Column */}
          <div>
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Поиск возможностей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:w-auto"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтры
                </Button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="bg-card border border-border/60 rounded-lg p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Категория</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedCategory === cat
                              ? "bg-primary text-white"
                              : "bg-background border border-border hover:border-primary/40"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Направление</h3>
                    <div className="flex flex-wrap gap-2">
                      {fields.map((field) => (
                        <button
                          key={field}
                          onClick={() => setSelectedField(field)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedField === field
                              ? "bg-primary text-white"
                              : "bg-background border border-border hover:border-primary/40"
                          }`}
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Класс</h3>
                    <div className="flex flex-wrap gap-2">
                      {grades.map((grade) => (
                        <button
                          key={grade}
                          onClick={() => setSelectedGrade(grade)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedGrade === grade
                              ? "bg-primary text-white"
                              : "bg-background border border-border hover:border-primary/40"
                          }`}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Стоимость</h3>
                    <div className="flex flex-wrap gap-2">
                      {costs.map((cost) => (
                        <button
                          key={cost}
                          onClick={() => setSelectedCost(cost)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedCost === cost
                              ? "bg-primary text-white"
                              : "bg-background border border-border hover:border-primary/40"
                          }`}
                        >
                          {cost}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Найдено возможностей: <span className="font-semibold text-foreground">{filteredOpportunities.length}</span>
              </p>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOpportunities.map((opp) => {
                const daysLeft = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isSaved = savedItems.includes(opp.id);

                return (
                  <div
                    key={opp.id}
                    className="bg-card border-2 border-primary/20 rounded-lg p-6 hover:border-primary/50 transition-all group hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/30">
                        {opp.category}
                      </span>
                      <button
                        onClick={() => handleSave(opp.id)}
                        className={`transition-colors ${
                          isSaved ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {opp.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {opp.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{opp.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {new Date(opp.deadline).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      {daysLeft > 0 && (
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${getDeadlineColor(opp.deadline)}`}>
                          <Clock className="w-3 h-3" />
                          Осталось {daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}
                        </div>
                      )}
                      <div className="text-sm font-medium text-foreground">
                        {opp.cost}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {opp.grade.slice(0, 2).map((grade, idx) => (
                        <span key={idx} className="px-2 py-1 bg-muted text-xs rounded border border-border">
                          {grade}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {opp.keywords.slice(0, 3).map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium border border-primary/30">
                          #{keyword}
                        </span>
                      ))}
                    </div>

                    <Link href={`/opportunities/${opp.id}`}>
                      <Button size="sm" variant="outline" className="w-full border-primary/30 hover:bg-primary/10">
                        Подробнее
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar: University Grants Banner */}
          <div className="lg:sticky lg:top-8 h-fit">
            {/* Golden Banner */}
            <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/20 dark:via-amber-950/20 dark:to-orange-950/20 border-2 border-yellow-500 rounded-xl shadow-lg shadow-yellow-500/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 p-4 text-black">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <GraduationCap className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">Гранты вузов</h3>
                    <p className="text-xs text-black/80">Полное финансирование</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 w-fit">
                  <Award className="w-4 h-4 text-black" />
                  <span className="text-sm font-semibold text-black">100% грант</span>
                </div>
              </div>

              {/* University Cards */}
              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {universityAds.map((ad) => (
                  <a
                    key={ad.id}
                    href={ad.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white dark:bg-gray-900 border border-yellow-500/30 rounded-lg p-4 hover:border-yellow-500 hover:shadow-md hover:shadow-yellow-500/10 transition-all group"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {/* Logo Placeholder */}
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0 border border-yellow-500/30">
                        <GraduationCap className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 group-hover:text-yellow-600 transition-colors line-clamp-2">
                          {ad.university_name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {ad.description}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-yellow-600 transition-colors flex-shrink-0" />
                    </div>

                    {/* Requirements */}
                    <div className="mb-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                        <Trophy className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />
                        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                          {ad.min_score_info}
                        </span>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-1.5">
                      {ad.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30 rounded text-xs font-medium"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-t border-yellow-500/30">
                <p className="text-xs text-center text-muted-foreground">
                  Получи грант за высокие баллы 🎓
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 FM Edu. Образовательная платформа для школьников.
          </p>
        </div>
      </footer>
    </div>
  );
}
