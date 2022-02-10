import './shared/events';

addEventListener('keyup', (event: KeyboardEvent) => event.key === 'F5' && location.reload(), {
  passive: true,
});
