<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'ghost'

withDefaults(defineProps<{
    variant?: ButtonVariant
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean  
}>(), {
    variant: 'primary',
    type: 'button',
    disabled: false
})
</script>

<template>
    <button :type="type" 
            class="app-button"
            :class="`app-button--${variant}`"
            :disabled="disabled">
        <slot />
    </button>
</template>

<style scoped lang="scss">
.app-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 2.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    border-radius: 0.9rem;
    font: inherit;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition:
        transform 0.16s ease,
        border-color 0.16s ease,
        color 0.16s ease,
        background-color 0.16s ease,
        box-shadow 0.16s ease;

    &:hover:not(:disabled) {
        transform: translateY(-1px);
    }

    &:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        transform: none;
    }
}

.app-button--primary {
    border-color: var(--color-accent);
    background: var(--color-accent);
    color: var(--color-bg);
    box-shadow: 0 0.5rem 1.2rem color-mix(in srgb, var(--color-accent) 20%, transparent);

    &:hover:not(:disabled) {
        background: color-mix(in srgb, var(--color-accent) 90%, var(--color-bg));
    }
}

.app-button--secondary {
    border-color: var(--color-border);
    background: var(--color-bg-elevated);
    color: var(--color-text);

    &:hover:not(:disabled) {
        border-color: var(--color-accent);
        background: var(--color-bg-subtle);
    }
}

.app-button--ghost {
    border-color: transparent;
    background: transparent;
    color: var(--color-bg-muted);

    &:hover:not(:disabled) {
        background: var(--color-bg-subtle);
        color: var(--color-text);
    }
}
</style>