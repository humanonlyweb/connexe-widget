import { ref, computed, type MaybeRefOrGetter, toValue } from "vue";

export function useCarousel(totalItems: MaybeRefOrGetter<number>) {
  const currentIndex = ref(0);
  const direction = ref<"next" | "prev">("next");

  const count = computed(() => toValue(totalItems));

  const isPrevDisabled = computed(() => currentIndex.value === 0);
  const isNextDisabled = computed(() => currentIndex.value === count.value - 1);

  const next = () => {
    if (isNextDisabled.value) return;
    direction.value = "next";
    currentIndex.value++;
  };

  const prev = () => {
    if (isPrevDisabled.value) return;
    direction.value = "prev";
    currentIndex.value--;
  };

  const transitionName = computed(() => `slide-${direction.value}`);
  const touchStartX = ref(0);
  const touchEndX = ref(0);
  const minSwipeDistance = 50;

  const handleSwipe = () => {
    if (count.value <= 1) return;

    const distance = touchStartX.value - touchEndX.value;
    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      next();
    } else {
      prev();
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    if (count.value <= 1 || e.touches.length > 1) return;

    const touch = e.touches?.[0];
    if (!touch) return;
    touchEndX.value = 0;
    touchStartX.value = touch.screenX;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (count.value <= 1) return;

    const touch = e.changedTouches?.[0];
    if (!touch) return;
    touchEndX.value = touch.screenX;
    handleSwipe();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (count.value <= 1) return;

    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case "ArrowLeft":
        prev();
        break;
      case "ArrowRight":
        next();
        break;
    }
  };

  return {
    direction,
    currentIndex,
    transitionName,
    isPrevDisabled,
    isNextDisabled,
    onTouchStart,
    onTouchEnd,
    onKeyDown,
    next,
    prev,
  };
}
