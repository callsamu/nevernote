import { computed, inject, Injectable, NgZone, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LayoutStore {
  private ngZone = inject(NgZone);

  drawerOpen = signal(false);
  isDesktop = computed(() => this.screenWidth() >= 1024);

  private screenWidth = signal(window.innerWidth);

  private resizeListener = () =>
    this.ngZone.run(() => this.screenWidth.set(window.innerWidth));

  watchResize() {
    window.addEventListener('resize', this.resizeListener);
  }

  unwatchResize() {
    window.removeEventListener('resize', this.resizeListener);
  }

  openDrawer()  { this.drawerOpen.set(true);  }
  closeDrawer() { this.drawerOpen.set(false); }
}
