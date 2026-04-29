import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.turbonotify.com',
  integrations: [
    starlight({
      title: 'Turbo Notify',
      favicon: '/favicon.svg',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Português',
          lang: 'pt-BR',
        },
        en: {
          label: 'English',
        },
        es: {
          label: 'Español',
        },
      },
      sidebar: [
        {
          label: 'Geral',
          translations: { en: 'General', es: 'General' },
          items: [
            {
              slug: 'general/getting-started',
              label: 'Começo rápido',
              translations: { en: 'Quick Start', es: 'Inicio rápido' },
            },
            {
              slug: 'general/access-key',
              label: 'Chave de Acesso',
              translations: { en: 'Access Key', es: 'Clave de Acceso' },
            },
            {
              slug: 'general/abuse',
              label: 'Abuso',
              translations: { en: 'Abuse Prevention', es: 'Prevención de Abuso' },
            },
            {
              slug: 'general/next-steps',
              label: 'Próximos Passos',
              translations: { en: 'Next Steps', es: 'Próximos Pasos' },
            },
          ],
        },
        {
          label: 'Mensagens',
          translations: { en: 'Messages', es: 'Mensajes' },
          items: [
            {
              slug: 'messages/send',
              label: 'Envio',
              translations: { en: 'Send', es: 'Envio' },
            },
            {
              slug: 'messages/status',
              label: 'Status',
              translations: { en: 'Status', es: 'Estado' },
            },
            {
              slug: 'messages/webhook',
              label: 'Webhook',
              translations: { en: 'Webhook', es: 'Webhook' },
            },
            {
              slug: 'messages/retention',
              label: 'Retenção',
              translations: { en: 'Retention', es: 'Retención' },
            },
            {
              slug: 'messages/rate-limits',
              label: 'Limites',
              translations: { en: 'Rate Limits', es: 'Limites' },
            },
          ],
        },
        {
          label: 'Números Extras',
          translations: { en: 'Extra Numbers', es: 'Números Extra' },
          items: [
            {
              slug: 'extra-numbers/add',
              label: 'Inclusão',
              translations: { en: 'Add', es: 'Agregar' },
            },
            {
              slug: 'extra-numbers/status',
              label: 'Status',
              translations: { en: 'Status', es: 'Estado' },
            },
            {
              slug: 'extra-numbers/list',
              label: 'Listagem',
              translations: { en: 'List', es: 'Listar' },
            },
            {
              slug: 'extra-numbers/remove',
              label: 'Remoção',
              translations: { en: 'Remove', es: 'Eliminar' },
            },
            {
              slug: 'extra-numbers/activation',
              label: 'Ativação',
              translations: { en: 'Activation', es: 'Activación' },
            },
            {
              slug: 'extra-numbers/billing',
              label: 'Cobrança',
              translations: { en: 'Billing', es: 'Facturación' },
            },
          ],
        },
        {
          label: 'Mais Recursos',
          translations: { en: 'More Features', es: 'Más Recursos' },
          items: [
            {
              slug: 'other-features/reaction',
              label: 'Reação',
              translations: { en: 'Reactions', es: 'Reacciones' },
            },
            {
              slug: 'other-features/typing-indicator',
              label: 'Digitação',
              translations: { en: 'Typing Indicator', es: 'Indicador de Escritura' },
            },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
