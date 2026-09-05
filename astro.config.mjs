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
      // EN/ES removed until real translations exist — most pages under en/
      // and es/ were either stubs ("translation pending" banners pointing
      // back to PT-BR) or missing outright. A partially-translated site is
      // worse UX than a single, complete pt-BR site. Re-add the locales
      // block (root + en + es) once full parity is translated.
      locales: {
        root: {
          label: 'Português',
          lang: 'pt-BR',
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
              slug: 'general/byo-storage-setup',
              label: 'Armazenamento',
              translations: { en: 'Storage', es: 'Almacenamiento' },
            },
            {
              slug: 'general/mcp-server',
              label: 'Servidor MCP',
              translations: { en: 'MCP Server', es: 'Servidor MCP' },
            },
            {
              slug: 'general/next-steps',
              label: 'Próximos passos',
              translations: { en: 'Next Steps', es: 'Próximos Pasos' },
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
                  slug: 'messages/list',
                  label: 'Listar',
                  translations: { en: 'List', es: 'Listar' },
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
                  label: 'Consultar reações',
                  translations: { en: 'Get Reactions', es: 'Consultar reacciones' },
                },
                {
                  slug: 'messages/edit-delete',
                  label: 'Editar e deletar',
                  translations: { en: 'Edit & Delete', es: 'Editar y eliminar' },
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
              label: 'Enviar reação',
              translations: { en: 'Send Reaction', es: 'Enviar reacción' },
            },
            {
              slug: 'other-features/typing-indicator',
              label: 'Indicador de digitação',
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
          label: 'Organização',
          translations: { en: 'Organization', es: 'Organización' },
          items: [
            { slug: 'organizations/overview', label: 'Visão geral', translations: { en: 'Overview', es: 'Visión General' } },
          ],
        },
        {
          // `messages/webhook` is deliberately listed here as well as under
          // Números → Mensagens: it is the entry point for webhook setup
          // (URL, HMAC signature, envelope, retries), so a reader who opens
          // the section literally named "Webhooks" must find it here.
          label: 'Webhooks',
          translations: { en: 'Webhooks', es: 'Webhooks' },
          items: [
            { slug: 'messages/webhook', label: 'Configuração e envelope', translations: { en: 'Setup & Envelope', es: 'Configuración y envelope' } },
            { slug: 'webhooks/contact-events', label: 'Eventos de contato', translations: { en: 'Contact Events', es: 'Eventos de Contacto' } },
            { slug: 'webhooks/message-quota-events', label: 'Eventos de quota de mensagem', translations: { en: 'Message Quota Events', es: 'Eventos de Quota de Mensaje' } },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
