import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.turbonotify.com',
  integrations: [
    starlight({
      title: 'Turbo Notify',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Portugues',
          lang: 'pt-BR',
        },
        en: {
          label: 'English',
        },
        es: {
          label: 'Espanol',
        },
      },
      social: {
        github: 'https://github.com/turbo-notify',
      },
      sidebar: [
        {
          label: 'Geral',
          translations: { en: 'General', es: 'General' },
          items: [
            {
              slug: 'general/getting-started',
              label: 'Comeco rapido',
              translations: { en: 'Quick Start', es: 'Inicio rapido' },
            },
            {
              slug: 'general/access-key',
              label: 'Chave de Acesso',
              translations: { en: 'Access Key', es: 'Clave de Acceso' },
            },
            {
              slug: 'general/abuse',
              label: 'Abuso',
              translations: { en: 'Abuse Prevention', es: 'Prevencion de Abuso' },
            },
            {
              slug: 'general/next-steps',
              label: 'Proximos Passos',
              translations: { en: 'Next Steps', es: 'Proximos Pasos' },
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
              slug: 'messages/reply',
              label: 'Resposta',
              translations: { en: 'Reply', es: 'Respuesta' },
            },
            {
              slug: 'messages/retention',
              label: 'Retencao',
              translations: { en: 'Retention', es: 'Retencion' },
            },
            {
              slug: 'messages/rate-limits',
              label: 'Limites',
              translations: { en: 'Rate Limits', es: 'Limites' },
            },
          ],
        },
        {
          label: 'Numeros Extras',
          translations: { en: 'Extra Numbers', es: 'Numeros Extra' },
          items: [
            {
              slug: 'extra-numbers/add',
              label: 'Inclusao',
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
              label: 'Remocao',
              translations: { en: 'Remove', es: 'Eliminar' },
            },
            {
              slug: 'extra-numbers/activation',
              label: 'Ativacao',
              translations: { en: 'Activation', es: 'Activacion' },
            },
            {
              slug: 'extra-numbers/billing',
              label: 'Cobranca',
              translations: { en: 'Billing', es: 'Facturacion' },
            },
          ],
        },
        {
          label: 'Mais Recursos',
          translations: { en: 'More Features', es: 'Mas Recursos' },
          items: [
            {
              slug: 'other-features/reaction',
              label: 'Reacao',
              translations: { en: 'Reactions', es: 'Reacciones' },
            },
            {
              slug: 'other-features/typing-indicator',
              label: 'Digitacao',
              translations: { en: 'Typing Indicator', es: 'Indicador de Escritura' },
            },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/turbo-notify/public-docs-web/edit/main/',
      },
      lastUpdated: true,
    }),
  ],
});
