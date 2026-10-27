import { expect, test } from 'vitest';
import { BLOG_MOCK } from '../componentes/organismos/ListaBlog';

test('el artículo de perros tiene contenido propio', () => {
  expect(BLOG_MOCK[0].contenido).toContain('agua fresca disponible');
});
