import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.turbonotify.com',
  // The /extra-numbers/* section was folded into /numbers/* (domain-aligned
  // grouping realignment, ADR 2026-06-22). Redirect old links so they don't 404.
  redirects: {
    // `trailingSlash: 'ignore'` (default) normalises `/extra-numbers` and
    // `/extra-numbers/` to one route, so a single key covers both forms.
    // Listing both collides ("a static route cannot be defined more than once").
    '/extra-numbers': '/numbers/add/',
    '/extra-numbers/add': '/numbers/add/',
    '/extra-numbers/status': '/numbers/status/',
    '/extra-numbers/list': '/numbers/list/',
    '/extra-numbers/remove': '/numbers/remove/',
    '/extra-numbers/activation': '/numbers/activation/',
    '/extra-numbers/billing': '/numbers/billing/',
  },
  integrations: [
    starlight({
      title: 'Turbo Notify',
      favicon: '/favicon.svg',
      // Dark is the default color scheme across all Turbo Notify web surfaces.
      // Seed the stored preference for first-time visitors; the theme toggle still wins.
      head: [
        {
          tag: 'script',
          content:
            "try{if(!localStorage.getItem('starlight-theme'))localStorage.setItem('starlight-theme','dark')}catch(e){}",
        },
      ],
      logo: {
        // Single-line horizontal lockup (icon + "Turbo Notify") — ADR 2026-06-29,
        // shared with the dashboard + webhook-inspector headers for brand consistency.
        light: './src/assets/logo-lockup-light.svg',
        dark: './src/assets/logo-lockup-dark.svg',
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
              label: 'Chave de acesso',
              translations: { en: 'Access Key', es: 'Clave de Acceso' },
            },
            {
              slug: 'general/abuse',
              label: 'Abuso',
              translations: { en: 'Abuse Prevention', es: 'Prevención de Abuso' },
            },
            {
              slug: 'general/next-steps',
              label: 'Próximos passos',
              translations: { en: 'Next Steps', es: 'Próximos Pasos' },
            },
            {
              slug: 'general/byo-storage-setup',
              label: 'BYO Object Storage',
              translations: { en: 'BYO Object Storage', es: 'BYO Object Storage' },
              badge: {
                text: { 'pt-BR': 'Mídia', en: 'Media', es: 'Multimedia' },
                variant: 'default',
                class: 'tn-badge-media',
              },
            },
          ],
        },
        {
          // The number-scoped messaging domain (ADR 2026-06-22): messages,
          // contacts and groups all live below /v1/numbers/{alias}/…, so they
          // are grouped under a single "Numbers" section. Number lifecycle
          // (add/status/…) leads the section; the per-number resources follow.
          label: 'Números',
          translations: { en: 'Numbers', es: 'Números' },
          items: [
            {
              label: 'Gerenciamento de números',
              translations: { en: 'Number Management', es: 'Gestión de números' },
              items: [
                {
                  slug: 'numbers/add',
                  label: 'Inclusão',
                  translations: { en: 'Add', es: 'Agregar' },
                },
                {
                  slug: 'numbers/status',
                  label: 'Status',
                  translations: { en: 'Status', es: 'Estado' },
                },
                {
                  slug: 'numbers/list',
                  label: 'Listagem',
                  translations: { en: 'List', es: 'Listar' },
                },
                {
                  slug: 'numbers/remove',
                  label: 'Remoção',
                  translations: { en: 'Remove', es: 'Eliminar' },
                },
                {
                  slug: 'numbers/activation',
                  label: 'Ativação',
                  translations: { en: 'Activation', es: 'Activación' },
                },
                {
                  slug: 'numbers/billing',
                  label: 'Cobrança',
                  translations: { en: 'Billing', es: 'Facturación' },
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
                  slug: 'messages/send-media',
                  label: 'Envio de mídia',
                  translations: { en: 'Send Media', es: 'Envío de medios' },
                },
                {
                  slug: 'messages/get',
                  label: 'Consultar',
                  translations: { en: 'Get', es: 'Consultar' },
                },
                {
                  slug: 'messages/status',
                  label: 'Status',
                  translations: { en: 'Status', es: 'Estado' },
                },
                {
                  slug: 'messages/receipts',
                  label: 'Recibos',
                  translations: { en: 'Receipts', es: 'Recibos' },
                },
                {
                  slug: 'messages/reactions',
                  label: 'Reações',
                  translations: { en: 'Reactions', es: 'Reacciones' },
                },
                {
                  slug: 'messages/polling',
                  label: 'Polling de eventos',
                  translations: { en: 'Event Polling', es: 'Polling de eventos' },
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
                {
                  slug: 'messages/migration',
                  label: 'Migração',
                  translations: { en: 'Migration', es: 'Migración' },
                },
              ],
            },
            {
              label: 'Contatos',
              translations: { en: 'Contacts', es: 'Contactos' },
              items: [
                { slug: 'contacts/overview', label: 'Visão geral', translations: { en: 'Overview', es: 'Visión General' } },
                { slug: 'contacts/list', label: 'Listar', translations: { en: 'List', es: 'Listar' } },
                { slug: 'contacts/detail', label: 'Detalhe', translations: { en: 'Detail', es: 'Detalle' } },
                { slug: 'contacts/refresh', label: 'Refresh', translations: { en: 'Refresh', es: 'Refresh' } },
                { slug: 'contacts/profile-picture', label: 'Foto de perfil', translations: { en: 'Profile Picture', es: 'Foto de Perfil' } },
                { slug: 'contacts/errors', label: 'Erros', translations: { en: 'Errors', es: 'Errores' } },
              ],
            },
            {
              label: 'Grupos',
              translations: { en: 'Groups', es: 'Grupos' },
              items: [
                {
                  slug: 'groups/overview',
                  label: 'Visão geral',
                  translations: { en: 'Overview', es: 'Visión general' },
                },
                {
                  slug: 'groups/picture',
                  label: 'Foto do grupo',
                  translations: { en: 'Group Picture', es: 'Foto del Grupo' },
                },
                {
                  slug: 'groups/lifecycle-events',
                  label: 'Eventos de ciclo de vida',
                  translations: { en: 'Lifecycle Events', es: 'Eventos de ciclo de vida' },
                },
                {
                  slug: 'groups/limitations',
                  label: 'Limitações',
                  translations: { en: 'Limitations', es: 'Limitaciones' },
                },
              ],
            },
          ],
        },
        {
          label: 'Mais recursos',
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
        {
          label: 'Uso',
          translations: { en: 'Usage', es: 'Uso' },
          items: [
            { slug: 'usage/quota', label: 'Quota', translations: { en: 'Quota', es: 'Quota' } },
          ],
        },
        {
          label: 'Webhooks',
          translations: { en: 'Webhooks', es: 'Webhooks' },
          items: [
            { slug: 'webhooks/contact-events', label: 'Eventos de contato', translations: { en: 'Contact Events', es: 'Eventos de Contacto' } },
            { slug: 'webhooks/message-quota-events', label: 'Eventos de quota de mensagem', translations: { en: 'Message Quota Events', es: 'Eventos de Quota de Mensaje' } },
          ],
        },
        {
          label: 'Changelog',
          translations: { en: 'Changelog', es: 'Changelog' },
          items: [
            { slug: 'changelog/2026-06-22-number-scoped-routes', label: 'Rotas aninhadas por número', translations: { en: 'Number-nested routes', es: 'Rutas anidadas por número' } },
            { slug: 'changelog/2026-06-21-event-at-occurrence', label: 'at do evento = momento real', translations: { en: 'Event at = real moment', es: 'at del evento = momento real' } },
            { slug: 'changelog/2026-06-04-contact-id-recipient', label: 'contact_id como destinatário', translations: { en: 'contact_id as recipient', es: 'contact_id como destinatario' } },
            { slug: 'changelog/2026-06-04-typing-indicator-groups', label: 'Aviso de digitação em grupos', translations: { en: 'Group typing indicator', es: 'Indicador de escritura en grupos' } },
            { slug: 'changelog/2026-05-15-message-quota-activation', label: 'Ativação de quota de mensagem por tier' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
