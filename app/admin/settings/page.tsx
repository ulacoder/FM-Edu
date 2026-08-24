'use client';

import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Mail,
  Key,
  Save,
  Upload
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'FM Edu',
    siteDescription: 'Персонализированная образовательная платформа для школьников Казахстана',
    supportEmail: 'support@fmedu.kz',
    adminEmail: 'admin@fmedu.kz',
    enableRegistration: true,
    requireEmailVerification: false,
    allowGuestAccess: false,
    maintenanceMode: false,
    enableNotifications: true,
    enableEmailNotifications: true,
    notificationFrequency: 'daily',
    maxUploadSize: 50,
    allowedFileTypes: 'pdf,doc,docx,ppt,pptx,jpg,png,mp4,mp3',
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireStrongPassword: true,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    accentColor: '#F59E0B',
    darkMode: true,
    language: 'ru',
    timezone: 'Asia/Almaty',
    dateFormat: 'DD.MM.YYYY',
    currency: 'KZT'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem('fm_edu_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SettingSection = ({ icon: Icon, title, children }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Icon className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, name, type = 'text', value, onChange, placeholder = '' }: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  );

  const SelectField = ({ label, name, value, onChange, options }: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  const ToggleField = ({ label, description, name, value, onChange }: any) => (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange({ target: { name, value: !value } })}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-purple-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Настройки</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Конфигурация платформы FM Edu</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          {saved ? 'Сохранено ✓' : 'Сохранить'}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-medium">
          ✅ Настройки успешно сохранены
        </div>
      )}

      <div className="space-y-6">
        {/* General Settings */}
        <SettingSection icon={SettingsIcon} title="Общие настройки">
          <InputField
            label="Название сайта"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Описание</label>
            <textarea
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Email поддержки"
              name="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={handleChange}
            />
            <InputField
              label="Email администратора"
              name="adminEmail"
              type="email"
              value={settings.adminEmail}
              onChange={handleChange}
            />
          </div>
        </SettingSection>

        {/* Access Control */}
        <SettingSection icon={Shield} title="Доступ и безопасность">
          <ToggleField
            label="Разрешить регистрацию"
            description="Новые пользователи могут создавать аккаунты"
            name="enableRegistration"
            value={settings.enableRegistration}
            onChange={handleChange}
          />
          <ToggleField
            label="Требовать подтверждение email"
            description="Пользователи должны подтвердить email перед входом"
            name="requireEmailVerification"
            value={settings.requireEmailVerification}
            onChange={handleChange}
          />
          <ToggleField
            label="Гостевой доступ"
            description="Разрешить просмотр контента без авторизации"
            name="allowGuestAccess"
            value={settings.allowGuestAccess}
            onChange={handleChange}
          />
          <ToggleField
            label="Режим обслуживания"
            description="Временно закрыть доступ к платформе"
            name="maintenanceMode"
            value={settings.maintenanceMode}
            onChange={handleChange}
          />

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Пароли</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Минимальная длина"
                name="passwordMinLength"
                type="number"
                value={settings.passwordMinLength}
                onChange={handleChange}
              />
              <InputField
                label="Попыток входа"
                name="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4">
              <ToggleField
                label="Требовать сложный пароль"
                description="Буквы, цифры, спецсимволы"
                name="requireStrongPassword"
                value={settings.requireStrongPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mt-4">
              <ToggleField
                label="Двухфакторная аутентификация"
                description="Дополнительная защита через SMS/Email"
                name="twoFactorAuth"
                value={settings.twoFactorAuth}
                onChange={handleChange}
              />
            </div>
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection icon={Bell} title="Уведомления">
          <ToggleField
            label="Включить уведомления"
            description="Отправлять уведомления пользователям"
            name="enableNotifications"
            value={settings.enableNotifications}
            onChange={handleChange}
          />
          <ToggleField
            label="Email уведомления"
            description="Дублировать уведомления на email"
            name="enableEmailNotifications"
            value={settings.enableEmailNotifications}
            onChange={handleChange}
          />
          <SelectField
            label="Частота уведомлений"
            name="notificationFrequency"
            value={settings.notificationFrequency}
            onChange={handleChange}
            options={[
              { value: 'instant', label: 'Мгновенно' },
              { value: 'hourly', label: 'Каждый час' },
              { value: 'daily', label: 'Раз в день' },
              { value: 'weekly', label: 'Раз в неделю' }
            ]}
          />
        </SettingSection>

        {/* File Upload */}
        <SettingSection icon={Upload} title="Загрузка файлов">
          <InputField
            label="Максимальный размер (MB)"
            name="maxUploadSize"
            type="number"
            value={settings.maxUploadSize}
            onChange={handleChange}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Разрешенные типы файлов
            </label>
            <input
              type="text"
              name="allowedFileTypes"
              value={settings.allowedFileTypes}
              onChange={handleChange}
              placeholder="pdf,doc,docx,jpg,png"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Расширения через запятую</p>
          </div>
        </SettingSection>

        {/* Appearance */}
        <SettingSection icon={Palette} title="Внешний вид">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Основной цвет</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleChange}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={handleChange}
                  name="primaryColor"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Вторичный цвет</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={handleChange}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={handleChange}
                  name="secondaryColor"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Акцентный цвет</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="accentColor"
                  value={settings.accentColor}
                  onChange={handleChange}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={handleChange}
                  name="accentColor"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
          <ToggleField
            label="Темная тема по умолчанию"
            description="Использовать темный режим"
            name="darkMode"
            value={settings.darkMode}
            onChange={handleChange}
          />
        </SettingSection>

        {/* Localization */}
        <SettingSection icon={Globe} title="Локализация">
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Язык по умолчанию"
              name="language"
              value={settings.language}
              onChange={handleChange}
              options={[
                { value: 'ru', label: 'Русский' },
                { value: 'kk', label: 'Қазақша' },
                { value: 'en', label: 'English' }
              ]}
            />
            <SelectField
              label="Часовой пояс"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              options={[
                { value: 'Asia/Almaty', label: 'Алматы (UTC+6)' },
                { value: 'Asia/Aqtau', label: 'Актау (UTC+5)' },
                { value: 'Asia/Atyrau', label: 'Атырау (UTC+5)' }
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Формат даты"
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
              options={[
                { value: 'DD.MM.YYYY', label: 'ДД.MM.ГГГГ' },
                { value: 'MM/DD/YYYY', label: 'MM/ДД/ГГГГ' },
                { value: 'YYYY-MM-DD', label: 'ГГГГ-MM-ДД' }
              ]}
            />
            <SelectField
              label="Валюта"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              options={[
                { value: 'KZT', label: '₸ Тенге (KZT)' },
                { value: 'USD', label: '$ Доллар (USD)' },
                { value: 'EUR', label: '€ Евро (EUR)' }
              ]}
            />
          </div>
        </SettingSection>

        {/* System */}
        <SettingSection icon={Database} title="Система">
          <InputField
            label="Таймаут сессии (минуты)"
            name="sessionTimeout"
            type="number"
            value={settings.sessionTimeout}
            onChange={handleChange}
          />
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Кэш</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Очистить кэш приложения</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                Очистить
              </button>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">База данных</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Создать резервную копию</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                Бэкап
              </button>
            </div>
          </div>
        </SettingSection>
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          {saved ? 'Сохранено ✓' : 'Сохранить изменения'}
        </button>
      </div>
    </div>
  );
}
