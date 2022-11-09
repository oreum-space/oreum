<template>
  <button
    class="ui-button"
    :class="classes"
    :type="type || 'button'"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script
  setup
  lang="ts"
>
import { computed } from 'vue'

type Props = {
  type?: 'button' | 'submit' | 'reset'
  seriousness?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'passive'
  appearance?: '' | 'text' | 'outlined' | 'rounded' | 'rounded-outlined' | 'rounded-text'
  size?: 'small' | 'large'
  disabled?: boolean
}

const
  props = defineProps<Props>(),
  classes = computed(() => ({
    'ui-button_text': props.appearance === 'text',
    'ui-button_outlined': props.appearance === 'outlined',
    'ui-button_rounded': props.appearance === 'rounded',
    'ui-button_rounded-outlined': props.appearance === 'rounded-outlined',
    'ui-button_rounded-text': props.appearance === 'rounded-text',
    'ui-button_secondary': props.seriousness === 'secondary',
    'ui-button_success': props.seriousness === 'success',
    'ui-button_info': props.seriousness === 'info',
    'ui-button_warning': props.seriousness === 'warning',
    'ui-button_danger': props.seriousness === 'danger',
    'ui-button_passive': props.seriousness === 'passive',
    'ui-button_large': props.size === 'large',
    'ui-button_small': props.size === 'small'
  }))
</script>

<style lang="scss">
button,
.ui-button {
  appearance: none;
  outline: none;
  border: none;
  padding: 8px 12px;
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  border-radius: 4px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  line-height: 20px;
  font-weight: 600;
  white-space: nowrap;
  font-family: inherit;
  transition: background-color var(--transition-cubic-fast);

  &_large {
    padding: 10px 14px;
  }

  &_small {
    padding: 6px 10px;
  }

  &:not(&:disabled) {
    cursor: pointer;
  }
  &:hover {
    background-color: var(--primary-color-hover);
  }
  &:focus {
    background-color: var(--primary-color-focus);
  }
  &:active {
    background-color: var(--primary-color-active);
  }
  &_secondary {
    background-color: var(--secondary-color);

    &:hover {
      background-color: var(--secondary-color-hover);
    }
    &:focus {
      background-color: var(--secondary-color-focus);
    }
    &:active {
      background-color: var(--secondary-color-active);
    }
  }
  &_success {
    background-color: var(--success-color);

    &:hover {
      background-color: var(--success-color-hover);
    }
    &:focus {
      background-color: var(--success-color-focus);
    }
    &:active {
      background-color: var(--success-color-active);
    }
  }
  &_info {
    background-color: var(--info-color);

    &:hover {
      background-color: var(--info-color-hover);
    }
    &:focus {
      background-color: var(--info-color-focus);
    }
    &:active {
      background-color: var(--info-color-active);
    }
  }
  &_warning {
    background-color: var(--warning-color);

    &:hover {
      background-color: var(--warning-color-hover);
    }
    &:focus {
      background-color: var(--warning-color-focus);
    }
    &:active {
      background-color: var(--warning-color-active);
    }
  }
  &_danger {
    background-color: var(--danger-color);

    &:hover {
      background-color: var(--danger-color-hover);
    }
    &:focus {
      background-color: var(--danger-color-focus);
    }
    &:active {
      background-color: var(--danger-color-active);
    }
  }
  &_passive {
    background-color: var(--passive-color);

    &:hover {
      background-color: var(--passive-color-hover);
    }
    &:focus {
      background-color: var(--passive-color-focus);
    }
    &:active {
      background-color: var(--passive-color-active);
    }
  }

  &_rounded-outlined,
  &_outlined {
    padding: 7px 11px;
    border: 1px solid var(--primary-color);

    border-color: currentColor;

    &.ui-button_large {
      padding: 9px 13px;
    }

    &.ui-button_small {
      padding: 5px 9px;
    }
  }



  &_rounded-outlined,
  &_rounded-text,
  &_outlined,
  &_text {
    background-color: transparent;
    color: var(--primary-color);

    &:hover {
      background-color: var(--primary-color-hover-text);
    }
    &:focus {
      background-color: var(--primary-color-focus-text);
    }
    &:active {
      background-color: var(--primary-color-active-text);
    }

    &.ui-button {
      &_secondary {
        color: var(--secondary-color);

        &:hover {
          background-color: var(--secondary-color-hover-text);
        }
        &:focus {
          background-color: var(--secondary-color-focus-text);
        }
        &:active {
          background-color: var(--secondary-color-active-text);
        }
      }
      &_success {
        color: var(--success-color);

        &:hover {
          background-color: var(--success-color-hover-text);
        }
        &:focus {
          background-color: var(--success-color-focus-text);
        }
        &:active {
          background-color: var(--success-color-active-text);
        }
      }
      &_info {
        color: var(--info-color);

        &:hover {
          background-color: var(--info-color-hover-text);
        }
        &:focus {
          background-color: var(--info-color-focus-text);
        }
        &:active {
          background-color: var(--info-color-active-text);
        }
      }
      &_warning {
        color: var(--warning-color);

        &:hover {
          background-color: var(--warning-color-hover-text);
        }
        &:focus {
          background-color: var(--warning-color-focus-text);
        }
        &:active {
          background-color: var(--warning-color-active-text);
        }
      }
      &_danger {
        color: var(--danger-color);

        &:hover {
          background-color: var(--danger-color-hover-text);
        }
        &:focus {
          background-color: var(--danger-color-focus-text);
        }
        &:active {
          background-color: var(--danger-color-active-text);
        }
      }
      &_passive {
        color: var(--passive-color);

        &:hover {
          background-color: var(--passive-color-hover-text);
        }
        &:focus {
          background-color: var(--passive-color-focus-text);
        }
        &:active {
          background-color: var(--passive-color-active-text);
        }
      }
    }
  }

  &_rounded-text,
  &_rounded-outlined,
  &_rounded {
    border-radius: 18px;
  }

  &:disabled {
    background-color: var(--surface-d);
    color: #ffffff61 !important;
  }
}
</style>