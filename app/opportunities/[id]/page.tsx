"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Building2,
  Clock,
} from "lucide-react";

// Те же данные возможностей
const opportunities = [
  {
    id: 1,
    title: "Международная олимпиада по математике",
    description: "Престижная олимпиада для школьников 9-11 классов. Победители получают дипломы и гранты на обучение.",
    fullDescription: "Международная олимпиада по математике — это престижное соревнование для талантливых школьников со всего мира. Участники решают сложные математические задачи, демонстрируя глубокое понимание алгебры, геометрии, комбинаторики и теории чисел. Олимпиада проходит в два этапа: региональный отборочный тур и финальный международный этап. Победители получают дипломы, медали и возможность бесплатного обучения в ведущих университетах мира.",
    category: "Олимпиада",
    tags: ["Математика", "STEM"],
    grade: ["9 класс", "10 класс", "11 класс"],
    location: "Онлайн (региональный тур), Международный (финал)",
    deadline: "2026-10-15",
    cost: "Бесплатно",
    format: "Онлайн + Очно",
    organizer: "Международный математический союз",
    organizerDescription: "Международная организация, объединяющая математиков со всего мира и проводящая престижные соревнования для школьников и студентов.",
    applicationLink: "https://example.com/apply",
    requirements: "Для участия необходимо: быть учеником 9-11 класса, иметь базовые знания математики на уровне школьной программы и выше, пройти регистрацию на официальном сайте, получить рекомендацию от учителя математики.",
    benefits: [
      "Диплом международного образца",
      "Денежные призы для победителей (до $5,000)",
      "Гранты на обучение в топовых университетах",
      "Возможность познакомиться с талантливыми сверстниками",
      "Менторство от профессоров математики",
    ],
    keywords: ["математика", "олимпиада", "международная"]
  },
  {
    id: 2,
    title: "Хакатон Code for Future",
    description: "48-часовой хакатон для школьников. Создавай проекты, решающие реальные проблемы. Призовой фонд 500,000 тг.",
    fullDescription: "Code for Future — это масштабный хакатон для школьников, увлеченных программированием и технологиями. В течение 48 часов команды из 2-4 человек разрабатывают проекты, решающие реальные проблемы в области образования, экологии или социального развития. Участники получают доступ к менторам из IT-компаний, бесплатное питание и мерч. Лучшие проекты получают денежные призы и возможность дальнейшего развития с поддержкой партнеров.",
    category: "Хакатон",
    tags: ["IT", "Программирование"],
    grade: ["10 класс", "11 класс", "12 класс"],
    location: "Алматы, IT Park",
    deadline: "2026-09-20",
    cost: "Бесплатно",
    format: "Очно",
    organizer: "Code for Future Foundation",
    organizerDescription: "Некоммерческая организация, поддерживающая молодых разработчиков и проводящая образовательные мероприятия в сфере IT.",
    applicationLink: "https://example.com/hackathon",
    requirements: "Команда из 2-4 человек, базовые навыки программирования (любой язык), ноутбук для разработки, желание учиться и создавать проекты.",
    benefits: [
      "Призовой фонд 500,000 тг (1 место - 250,000 тг)",
      "Менторство от разработчиков из Google, Яндекс, Kaspi",
      "Бесплатное питание и мерч",
      "Сертификат участника",
      "Возможность стажировки в IT-компаниях для победителей",
    ],
    keywords: ["программирование", "хакатон", "it"]
  },
  {
    id: 3,
    title: "Стипендия Болашак для школьников",
    description: "Программа поддержки талантливых школьников. Покрывает обучение в топовых университетах мира.",
    fullDescription: "Стипендия Болашак для школьников — это государственная программа поддержки талантливых учеников, планирующих обучение в ведущих университетах мира. Программа покрывает стоимость обучения, проживания, перелетов и медицинской страховки. Стипендиаты получают также поддержку в подготовке документов, сдаче международных экзаменов и адаптации за рубежом. После окончания обучения выпускники обязуются вернуться в Казахстан и отработать определенный срок.",
    category: "Стипендия",
    tags: ["Стипендия"],
    grade: ["11 класс", "12 класс"],
    location: "Международная",
    deadline: "2026-11-30",
    cost: "Бесплатно",
    format: "Заочно",
    organizer: "Министерство образования РК",
    organizerDescription: "Государственная программа подготовки кадров за рубежом, действующая с 1993 года.",
    applicationLink: "https://bolashak.gov.kz",
    requirements: "Средний балл аттестата не ниже 4.5, результаты IELTS/TOEFL, рекомендательные письма, эссе о целях обучения, победы в олимпиадах или конкурсах (преимущество).",
    benefits: [
      "Полное покрытие стоимости обучения",
      "Ежемесячная стипендия на проживание",
      "Оплата перелетов",
      "Медицинская страховка",
      "Поддержка в адаптации за рубежом",
    ],
    keywords: ["стипендия", "обучение", "грант"]
  },
  {
    id: 4,
    title: "Летняя школа STEM в MIT",
    description: "Двухнедельная программа в MIT для школьников. Лекции, лабораторные работы и проекты с профессорами.",
    fullDescription: "Летняя школа STEM в MIT предлагает уникальную возможность погрузиться в мир науки и технологий в одном из лучших университетов мира. Программа включает лекции от профессоров MIT, практические лабораторные работы, работу над групповыми проектами и экскурсии по исследовательским центрам. Участники также знакомятся с процессом поступления в американские университеты и общаются со студентами MIT.",
    category: "Летняя программа",
    tags: ["STEM", "Наука"],
    grade: ["10 класс", "11 класс"],
    location: "США, Бостон (MIT Campus)",
    deadline: "2026-12-01",
    cost: "Платно ($3,500) - стипендии доступны",
    format: "Очно",
    organizer: "Massachusetts Institute of Technology",
    organizerDescription: "Один из ведущих технических университетов мира, известный передовыми исследованиями в области науки и технологий.",
    applicationLink: "https://summer.mit.edu",
    requirements: "Хорошее знание английского языка (TOEFL 80+ или IELTS 6.5+), интерес к STEM дисциплинам, мотивационное эссе, рекомендация от учителя.",
    benefits: [
      "Обучение в MIT в течение 2 недель",
      "Сертификат от MIT",
      "Опыт жизни в США",
      "Нетворкинг с студентами и профессорами MIT",
      "Возможность получить стипендию (покрывает до 100% стоимости)",
    ],
    keywords: ["летняя школа", "mit", "наука"]
  },
  {
    id: 5,
    title: "Конкурс научных проектов Junior Scientist",
    description: "Представь свой исследовательский проект. Победители получают гранты на дальнейшие исследования.",
    fullDescription: "Junior Scientist — это конкурс для школьников, занимающихся научными исследованиями. Участники представляют свои проекты в области физики, химии, биологии, математики или информатики. Жюри состоит из ученых из ведущих университетов и исследовательских центров. Победители получают денежные гранты на продолжение исследований, публикацию результатов и участие в международных научных конференциях.",
    category: "Конкурс",
    tags: ["Наука", "STEM"],
    grade: ["8 класс", "9 класс", "10 класс", "11 класс"],
    location: "Астана, Nazarbayev University",
    deadline: "2026-10-30",
    cost: "Бесплатно",
    format: "Очно",
    organizer: "Nazarbayev University",
    organizerDescription: "Ведущий исследовательский университет Казахстана, реализующий международные стандарты образования.",
    applicationLink: "https://nu.edu.kz/junior-scientist",
    requirements: "Исследовательский проект (не менее 10 страниц), презентация проекта, научный руководитель (учитель или ученый), соответствие научным стандартам оформления.",
    benefits: [
      "Гранты на исследования (до 500,000 тг)",
      "Публикация лучших проектов в научном журнале",
      "Менторство от ученых Nazarbayev University",
      "Возможность участия в международных конференциях",
      "Льготы при поступлении в NU",
    ],
    keywords: ["наука", "исследования", "проект"]
  },
  {
    id: 6,
    title: "Олимпиада по физике Satbayev University",
    description: "Республиканская олимпиада по физике. Призеры получают льготы при поступлении.",
    fullDescription: "Республиканская олимпиада по физике проводится Satbayev University для выявления талантливых школьников, интересующихся физикой и техническими науками. Олимпиада состоит из двух этапов: отборочного (онлайн) и финального (очно). Задания охватывают механику, термодинамику, электродинамику и оптику. Призеры получают дипломы, денежные призы и гарантированные льготы при поступлении в Satbayev University.",
    category: "Олимпиада",
    tags: ["Физика", "STEM"],
    grade: ["10 класс", "11 класс", "12 класс"],
    location: "Алматы, Satbayev University",
    deadline: "2026-09-30",
    cost: "Бесплатно",
    format: "Онлайн + Очно",
    organizer: "Satbayev University",
    organizerDescription: "Крупнейший технический университет Казахстана, специализирующийся на инженерных и естественных науках.",
    applicationLink: "https://satbayev.university/olympiad",
    requirements: "Ученик 10-12 класса, знание физики на уровне школьной программы и выше, регистрация на сайте университета.",
    benefits: [
      "Дипломы и медали для призеров",
      "Денежные призы (1 место - 200,000 тг)",
      "Грант на обучение в Satbayev University (100% для 1 места)",
      "Зачисление без экзаменов для победителей",
    ],
    keywords: ["физика", "олимпиада"]
  },
  {
    id: 7,
    title: "Конференция Young Leaders Summit",
    description: "Конференция для будущих лидеров. Networking, воркшопы и менторство от успешных предпринимателей.",
    fullDescription: "Young Leaders Summit — это трехдневная конференция для школьников, мечтающих стать лидерами в своей области. Программа включает выступления успешных предпринимателей, политиков и общественных деятелей, интерактивные воркшопы по лидерству, командообразованию и коммуникации, а также нетворкинг-сессии. Участники работают над групповыми проектами и презентуют их перед жюри.",
    category: "Конференция",
    tags: ["Бизнес", "Социальное влияние"],
    grade: ["9 класс", "10 класс", "11 класс", "12 класс"],
    location: "Шымкент, Rixos Hotel",
    deadline: "2026-11-15",
    cost: "Платно (10,000 тг)",
    format: "Очно",
    organizer: "Young Leaders Foundation",
    organizerDescription: "Организация, развивающая лидерские качества у молодежи через образовательные мероприятия.",
    applicationLink: "https://youngleaders.kz",
    requirements: "Мотивационное эссе (до 500 слов), рекомендация от учителя или руководителя проекта, оплата регистрационного взноса.",
    benefits: [
      "Выступления от топ-спикеров Казахстана",
      "Воркшопы по лидерству и soft skills",
      "Нетворкинг с амбициозными сверстниками",
      "Сертификат участника",
      "Возможность найти менторов",
    ],
    keywords: ["лидерство", "бизнес", "конференция"]
  },
  {
    id: 8,
    title: "Исследовательская программа в КазНУ",
    description: "Летняя исследовательская программа для школьников. Работа в лабораториях университета с учеными.",
    fullDescription: "Летняя исследовательская программа в КазНУ им. аль-Фараби дает школьникам возможность погрузиться в научную работу под руководством опытных ученых. Участники выбирают направление (физика, химия, биология, математика или информатика), работают над мини-проектом в лабораториях университета и представляют результаты на финальной конференции. Программа длится 4 недели и включает лекции, семинары и экскурсии.",
    category: "Исследовательская программа",
    tags: ["Наука", "STEM"],
    grade: ["10 класс", "11 класс"],
    location: "Алматы, КазНУ им. аль-Фараби",
    deadline: "2026-12-20",
    cost: "Бесплатно",
    format: "Очно",
    organizer: "КазНУ им. аль-Фараби",
    organizerDescription: "Крупнейший классический университет Казахстана с сильной научно-исследовательской базой.",
    applicationLink: "https://kaznu.kz/summer-research",
    requirements: "Интерес к науке, средний балл не ниже 4.0, эссе о научных интересах, рекомендация от учителя.",
    benefits: [
      "Работа в университетских лабораториях",
      "Менторство от профессоров и PhD студентов",
      "Сертификат о прохождении программы",
      "Возможность опубликовать результаты",
      "Опыт научной работы для портфолио",
    ],
    keywords: ["исследования", "университет", "лаборатория"]
  }
];

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const id = parseInt(params.id as string);
  const opportunity = opportunities.find(opp => opp.id === id);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));

    // Check if saved
    const savedItems = localStorage.getItem(`saved_opportunities_${JSON.parse(userStr).id}`);
    if (savedItems) {
      const parsed = JSON.parse(savedItems);
      setSaved(parsed.includes(id));
    }
  }, [router, id]);

  const handleSave = () => {
    if (!user) return;

    const savedKey = `saved_opportunities_${user.id}`;
    const savedItems = localStorage.getItem(savedKey);
    let items = savedItems ? JSON.parse(savedItems) : [];

    if (saved) {
      items = items.filter((item: number) => item !== id);
    } else {
      items.push(id);
    }

    localStorage.setItem(savedKey, JSON.stringify(items));
    setSaved(!saved);
  };

  if (!user) return null;

  if (!opportunity) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">Возможность не найдена</h1>
            <Link href="/opportunities">
              <Button>Вернуться к списку</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil((new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Content */}
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/opportunities">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к возможностям
            </Button>
          </Link>

          {/* Header */}
          <div className="bg-card border border-border/60 rounded-lg p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg font-medium border border-primary/30">
                  {opportunity.category}
                </span>
                <h1 className="text-3xl font-heading font-bold mt-4 mb-2">
                  {opportunity.title}
                </h1>
                <p className="text-muted-foreground">{opportunity.description}</p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-muted-foreground text-xs">Дедлайн</p>
                  <p className="font-medium">{new Date(opportunity.deadline).toLocaleDateString('ru-RU')}</p>
                  <p className="text-xs text-primary">{daysLeft} дней осталось</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-muted-foreground text-xs">Формат</p>
                  <p className="font-medium">{opportunity.format}</p>
                  <p className="text-xs">{opportunity.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-muted-foreground text-xs">Стоимость</p>
                  <p className="font-medium">{opportunity.cost}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-muted-foreground text-xs">Организатор</p>
                  <p className="font-medium text-xs">{opportunity.organizer}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {opportunity.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-muted text-sm rounded-lg border border-border">
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {opportunity.applicationLink && (
                <a href={opportunity.applicationLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Подать заявку
                  </Button>
                </a>
              )}
              <Button
                size="lg"
                variant={saved ? "secondary" : "outline"}
                onClick={handleSave}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${saved ? "fill-current" : ""}`} />
                {saved ? "Сохранено" : "Сохранить"}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Full Description */}
              <div className="bg-card border border-border/60 rounded-lg p-6">
                <h2 className="text-xl font-heading font-bold mb-4">О программе</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {opportunity.fullDescription}
                </p>
              </div>

              {/* Requirements */}
              {opportunity.requirements && (
                <div className="bg-card border border-border/60 rounded-lg p-6">
                  <h2 className="text-xl font-heading font-bold mb-4">Требования</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {opportunity.requirements}
                  </p>
                </div>
              )}

              {/* Benefits */}
              {opportunity.benefits && opportunity.benefits.length > 0 && (
                <div className="bg-card border border-border/60 rounded-lg p-6">
                  <h2 className="text-xl font-heading font-bold mb-4">Что вы получите</h2>
                  <ul className="space-y-3">
                    {opportunity.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Organizer Info */}
              <div className="bg-card border border-border/60 rounded-lg p-6">
                <h3 className="font-heading font-semibold mb-3">Организатор</h3>
                <p className="font-medium mb-2">{opportunity.organizer}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {opportunity.organizerDescription}
                </p>
                {opportunity.applicationLink && (
                  <a href={opportunity.applicationLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Официальный сайт
                    </Button>
                  </a>
                )}
              </div>

              {/* Target Audience */}
              <div className="bg-card border border-border/60 rounded-lg p-6">
                <h3 className="font-heading font-semibold mb-3">Целевая аудитория</h3>
                <div className="space-y-2">
                  {opportunity.grade.map((grade) => (
                    <div key={grade} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>{grade}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Dates */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="font-heading font-semibold mb-3">Важные даты</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Дедлайн заявки</p>
                    <p className="font-semibold">{new Date(opportunity.deadline).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <div className="pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <p className="text-sm font-medium text-primary">
                        Осталось {daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}
                      </p>
                    </div>
                  </div>
                </div>
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
