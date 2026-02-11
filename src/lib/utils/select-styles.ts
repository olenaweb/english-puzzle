import { StylesConfig } from 'react-select';

/**
 * Custom styles for react-select, matching the application's design system
 * Uses CSS variables for colors: --detail-color, --dark-detail-color, --outline-color, --white-color
 */
export function getCustomSelectStyles<T>(): StylesConfig<T, false> {
  return {
    control: (provided, state) => ({
      ...provided,
      height: '30px',
      minHeight: '30px',
      // added fixed width to prevent resizing when options have different label lengths
      width: '90px',
      padding: '0 0.5rem',
      border: `2px solid ${state.isFocused ? 'var(--detail-color)' : 'var(--detail-color)'}`,
      borderRadius: '6px',
      backgroundColor: 'var(--outline-color)',
      fontSize: 'clamp(0.875rem, 0.7788rem + 0.3846vw, 1.125rem)',
      fontWeight: 600,
      color: 'rgb(75, 79, 2)',
      cursor: 'pointer',
      boxShadow: state.isFocused ? '0 0 0 1px var(--detail-color)' : 'none',
      '&:hover': {
        borderColor: 'var(--detail-color)',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0',
      height: '26px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
      color: 'rgb(75, 79, 2)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'rgb(75, 79, 2)',
      fontWeight: 600,
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '0 4px',
      color: 'var(--detail-color)',
      '&:hover': {
        color: 'var(--dark-detail-color)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      width: '90px',
      borderRadius: '6px',
      overflow: 'hidden',
      border: '2px solid var(--detail-color)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'var(--detail-color)'
        : state.isFocused
          ? 'rgba(104, 109, 4, 0.1)'
          : 'var(--white-color)',
      color: state.isSelected ? 'var(--white-color)' : 'rgb(75, 79, 2)',
      fontWeight: state.isSelected ? 700 : 600,
      cursor: 'pointer',
      padding: '8px 12px',
      fontSize: 'clamp(0.875rem, 0.7788rem + 0.3846vw, 1.125rem)',
      '&:active': {
        backgroundColor: 'var(--detail-color)',
      },
    }),
  };
}
