import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { movedPageRedirects } from './src/data/moved-pages.mjs';

/** Sidebar entry for a page: pt-BR label plus its English translation. */
const page = (slug, pt, en) => ({ slug, label: pt, translations: { en } });

/** Sidebar group: pt-BR label plus its English translation. */
const group = (pt, en, items) => ({ label: pt, translations: { en }, items });

export default defineConfig({
  site: 'https://docs.turbonotify.com',
  redirects: movedPageRedirects(),
  vite: {
    build: {
      // The interactive API reference (Scalar) ships as one large chunk that
      // only the two /api-reference/ pages load. Every other page stays small.
      chunkSizeWarningLimit: 4096,
    },
  },
  integrations: [
    starlight({
      title: 'Turbo Notify',
      description:
        'Documentação do Turbo Notify: API de WhatsApp, agentes de IA pelo servidor MCP e revenda de números para os seus clientes.',
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
        // Single-line horizontal lockup (icon + "Turbo Notify"), shared with
        // the dashboard and the webhook inspector headers.
        light: './src/assets/logo-lockup-light.svg',
        dark: './src/assets/logo-lockup-dark.svg',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/turbo-notify/examples',
      },
      components: {
        SocialIcons: './src/components/SocialIcons.astro',
      },
      defaultLocale: 'root',
      locales: {
        root: { label: 'Português', lang: 'pt-BR' },
        en: { label: 'English', lang: 'en' },
      },
      sidebar: [
        group('Guias', 'Guides', [
          page('guides/quickstart', 'Começo rápido', 'Quickstart'),
          page('guides/ai-agent', 'Construa um agente de IA', 'Build an AI agent'),
          page('guides/resale', 'Revenda para seus clientes', 'Resell to your customers'),
        ]),
        group('Fundamentos', 'Essentials', [
          page('general/access-key', 'Chave de acesso', 'API key'),
          page('general/mcp-server', 'Servidor MCP', 'MCP server'),
          page('general/abuse', 'Evite bloqueios', 'Avoid blocks'),
          page('general/byo-storage-setup', 'Armazenamento', 'Storage'),
        ]),
        // Messages, contacts and groups all live below /v1/numbers/{alias}/…,
        // so they are grouped under a single "Numbers" section. Number
        // management leads the section; the per-number resources follow.
        group('Números', 'Numbers', [
          group('Gerenciamento de números', 'Number management', [
            page('numbers/overview', 'Visão geral', 'Overview'),
            page('numbers/add', 'Inclusão', 'Add'),
            page('numbers/pairing', 'Pareamento', 'Pairing'),
            page('numbers/status', 'Status', 'Status'),
            page('numbers/list', 'Listagem', 'List'),
            page('numbers/activation', 'Conexão', 'Connection'),
            page('numbers/update', 'Atualização', 'Update'),
            page('numbers/remove', 'Remoção', 'Remove'),
            page('numbers/billing', 'Cobrança', 'Billing'),
          ]),
          group('Mensagens', 'Messages', [
            page('messages/send', 'Envio', 'Send'),
            page('messages/send-media', 'Envio de mídia', 'Send media'),
            page('messages/list', 'Listar', 'List'),
            page('messages/get', 'Consultar', 'Get'),
            page('messages/status', 'Status', 'Status'),
            page('messages/receipts', 'Recibos', 'Receipts'),
            page('messages/reactions', 'Consultar reações', 'Get reactions'),
            page('messages/edit-delete', 'Editar e apagar', 'Edit and delete'),
            page('messages/polling', 'Polling de eventos', 'Event polling'),
            page('messages/webhook', 'Webhook', 'Webhook'),
            page('messages/retention', 'Retenção', 'Retention'),
            page('messages/rate-limits', 'Limites', 'Rate limits'),
          ]),
          group('Contatos', 'Contacts', [
            page('contacts/overview', 'Visão geral', 'Overview'),
            page('contacts/list', 'Listar', 'List'),
            page('contacts/detail', 'Detalhe', 'Detail'),
            page('contacts/refresh', 'Atualizar', 'Refresh'),
            page('contacts/profile-picture', 'Foto de perfil', 'Profile picture'),
            page('contacts/errors', 'Erros', 'Errors'),
          ]),
          group('Grupos', 'Groups', [
            page('groups/overview', 'Visão geral', 'Overview'),
            page('groups/picture', 'Foto do grupo', 'Group picture'),
            page('groups/lifecycle-events', 'Eventos de ciclo de vida', 'Lifecycle events'),
            page('groups/limitations', 'Limitações', 'Limitations'),
          ]),
        ]),
        group('Mais recursos', 'More features', [
          page('other-features/reaction', 'Enviar reação', 'Send a reaction'),
          page('other-features/typing-indicator', 'Indicador de digitação', 'Typing indicator'),
          page('other-features/mark-as-read', 'Marcar como lida', 'Mark as read'),
        ]),
        group('Uso', 'Usage', [page('usage/quota', 'Cota', 'Quota')]),
        group('Organização', 'Organization', [
          page('organizations/overview', 'Visão geral', 'Overview'),
        ]),
        // `messages/webhook` is listed here as well as under Números →
        // Mensagens: it is the entry point for webhook setup (URL, signature,
        // envelope, retries), so a reader who opens the section literally
        // named "Webhooks" must find it here.
        group('Webhooks', 'Webhooks', [
          page('messages/webhook', 'Configuração e envelope', 'Setup and envelope'),
          page('webhooks/contact-events', 'Eventos de contato', 'Contact events'),
          page('webhooks/message-quota-events', 'Eventos de cota de mensagem', 'Message quota events'),
        ]),
        group('Referência', 'Reference', [
          page('reference/api', 'Referência da API', 'API reference'),
          page('reference/errors', 'Códigos de erro', 'Error codes'),
        ]),
        group('Ajuda', 'Help', [
          page('help/support', 'Suporte', 'Support'),
          page('help/changelog', 'Novidades', 'Changelog'),
        ]),
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
