'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { MBTIMatchMode } from '@/types/matchmaking';
import { formatMBTIMatchMode, isValidMBTI } from '@/lib/mbti-matcher';

const DOMAINS = [
  'IT & Программирование',
  'Дизайн',
  'Физика',
  'Математика',
  'Химия',
  'Биология',
  'Олимпиады',
  'Стартап',
  'Творчество',
  'Другое',
];

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

interface CreateProjectFormProps {
  userMBTI?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateProjectForm({
  userMBTI,
  onSuccess,
  onCancel,
}: CreateProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Форма
  const [domain, setDomain] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [mbtiMatchMode, setMbtiMatchMode] = useState<MBTIMatchMode>('auto');
  const [targetMBTI, setTargetMBTI] = useState(userMBTI || '');

  // Навыки
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [lookingForSkills, setLookingForSkills] = useState<string[]>([]);
  const [currentUserSkill, setCurrentUserSkill] = useState('');
  const [currentLookingForSkill, setCurrentLookingForSkill] = useState('');

  const addUserSkill = () => {
    if (currentUserSkill.trim() && !userSkills.includes(currentUserSkill.trim())) {
      setUserSkills([...userSkills, currentUserSkill.trim()]);
      setCurrentUserSkill('');
    }
  };

  const removeUserSkill = (skill: string) => {
    setUserSkills(userSkills.filter((s) => s !== skill));
  };

  const addLookingForSkill = () => {
    if (
      currentLookingForSkill.trim() &&
      !lookingForSkills.includes(currentLookingForSkill.trim())
    ) {
      setLookingForSkills([...lookingForSkills, currentLookingForSkill.trim()]);
      setCurrentLookingForSkill('');
    }
  };

  const removeLookingForSkill = (skill: string) => {
    setLookingForSkills(lookingForSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!domain || !title) {
      toast.error('Пожалуйста, заполните обязательные поля');
      return;
    }

    if (userSkills.length === 0) {
      toast.error('Укажите хотя бы один навык, который вы привносите');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/matchmaking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          title,
          description,
          user_skills: userSkills,
          looking_for_skills: lookingForSkills,
          max_members: maxMembers,
          target_mbti_filter: mbtiMatchMode === 'any' ? null : targetMBTI,
          mbti_match_mode: mbtiMatchMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось создать заявку');
      }

      toast.success('Заявка успешно создана!');

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Сфера */}
      <div className="space-y-2">
        <Label htmlFor="domain">
          Сфера и направление <span className="text-red-500">*</span>
        </Label>
        <Select value={domain} onValueChange={setDomain}>
          <SelectTrigger id="domain">
            <SelectValue placeholder="Выберите сферу" />
          </SelectTrigger>
          <SelectContent>
            {DOMAINS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Название */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Название проекта/команды <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Например: Мобильное приложение для студентов"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Описание */}
      <div className="space-y-2">
        <Label htmlFor="description">Описание (опционально)</Label>
        <Textarea
          id="description"
          placeholder="Расскажите подробнее о проекте..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
        />
      </div>

      {/* Мои навыки */}
      <div className="space-y-2">
        <Label>
          Мои навыки и что я вношу <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Например: Python, React, дизайн"
            value={currentUserSkill}
            onChange={(e) => setCurrentUserSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUserSkill();
              }
            }}
          />
          <Button type="button" onClick={addUserSkill} size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {userSkills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <button
                type="button"
                onClick={() => removeUserSkill(skill)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Кого ищу */}
      <div className="space-y-2">
        <Label>Кого ищу / Требования к участникам</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Например: дизайнер UI/UX, backend-разработчик"
            value={currentLookingForSkill}
            onChange={(e) => setCurrentLookingForSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addLookingForSkill();
              }
            }}
          />
          <Button
            type="button"
            onClick={addLookingForSkill}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {lookingForSkills.map((skill) => (
            <Badge key={skill} variant="outline" className="gap-1">
              {skill}
              <button
                type="button"
                onClick={() => removeLookingForSkill(skill)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Размер команды */}
      <div className="space-y-2">
        <Label htmlFor="maxMembers">
          Размер команды <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-4">
          <Select
            value={maxMembers.toString()}
            onValueChange={(v) => setMaxMembers(parseInt(v))}
          >
            <SelectTrigger id="maxMembers" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n} {n === 1 ? 'человек' : 'человека'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              Счетчик: 1/{maxMembers}
            </span>
          </div>
        </div>
      </div>

      {/* MBTI фильтр */}
      <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
        <Label>Предпочтения по MBTI</Label>

        <Select
          value={mbtiMatchMode}
          onValueChange={(v) => setMbtiMatchMode(v as MBTIMatchMode)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Любой MBTI</SelectItem>
            <SelectItem value="auto">
              Автоподбор (совпадение 3 из 4 букв)
            </SelectItem>
            <SelectItem value="exact">Только конкретный тип</SelectItem>
          </SelectContent>
        </Select>

        {mbtiMatchMode !== 'any' && (
          <div className="space-y-2">
            <Label htmlFor="targetMBTI">Целевой MBTI тип</Label>
            <Select value={targetMBTI} onValueChange={setTargetMBTI}>
              <SelectTrigger id="targetMBTI">
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                {MBTI_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formatMBTIMatchMode(mbtiMatchMode, targetMBTI)}
            </p>
          </div>
        )}
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Создание...' : 'Создать заявку'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}
