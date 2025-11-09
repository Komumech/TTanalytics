document.addEventListener('DOMContentLoaded', function() {
    // --- Smart Form Validation ---
    const form = document.querySelector('.form');
    if (form) {
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const requiredFields = form.querySelectorAll('[required]');

        // --- Validation Helper ---
        const setValidity = (element, isValid, customMessage = '') => {
            const parent = element.closest('.form-group') || element.closest('.custom-select-wrapper');
            if (!parent) return isValid;

            const errorContainer = parent.querySelector('.error-message') || parent.nextElementSibling;
            const errorMessage = customMessage || element.dataset.errorMessage || 'This field is invalid.';

            if (isValid) {
                element.classList.remove('is-invalid');
                if (errorContainer && errorContainer.classList.contains('error-message')) {
                    errorContainer.textContent = '';
                    errorContainer.style.height = '0';
                    errorContainer.style.opacity = '0';
                }
            } else {
                element.classList.add('is-invalid');
                if (errorContainer && errorContainer.classList.contains('error-message')) {
                    errorContainer.textContent = errorMessage;
                    errorContainer.style.height = 'auto'; // Adjust to content
                    const height = errorContainer.scrollHeight + 'px';
                    errorContainer.style.height = height;
                    errorContainer.style.opacity = '1';
                }
            }
            return isValid;
        };

        // --- Validation Logic ---
        const validatePhone = () => {
            if (!phoneInput) return true;
            const hasInvalidChars = /[^0-9+\-() ]/.test(phoneInput.value);
            return setValidity(phoneInput, !hasInvalidChars, phoneInput.dataset.errorMessage);
        };

        const validateEmail = () => {
            if (!emailInput) return true;
            const isValidEmail = /\S+@\S+\.\S+/.test(emailInput.value);
            if (emailInput.value.trim() === '') return validateRequired(emailInput);
            return setValidity(emailInput, isValidEmail, emailInput.dataset.errorMessage);
        };

        const validateRequired = (field) => {
            if (field.type === 'checkbox') return setValidity(field, field.checked, field.dataset.errorMessage);
            const isFilled = field.value.trim() !== '';
            return setValidity(field, isFilled, field.dataset.errorMessage);
        };

        if (phoneInput) phoneInput.addEventListener('input', validatePhone);
        if (emailInput) emailInput.addEventListener('blur', validateEmail);

        requiredFields.forEach(field => {
            field.addEventListener('blur', () => validateRequired(field));
        });

        // --- Form Submission ---
        form.addEventListener('submit', function(event) {
            let isFormValid = true;
            requiredFields.forEach(field => {
                if (!validateRequired(field)) isFormValid = false;
            });
            if (emailInput && emailInput.value.trim() !== '' && !validateEmail()) isFormValid = false;
            if (phoneInput && phoneInput.value.trim() !== '' && !validatePhone()) isFormValid = false;

            if (!isFormValid) {
                event.preventDefault();
                console.log('Form submission blocked due to validation errors.');
            }
        });
    }

    // --- Custom Dropdown Implementation ---
    document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
        const originalSelect = wrapper.querySelector('select');
        if (!originalSelect) return;

        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        trigger.textContent = originalSelect.options[originalSelect.selectedIndex].textContent;
        const options = document.createElement('div');
        options.className = 'custom-options';

        Array.from(originalSelect.options).forEach((option) => {
            const customOption = document.createElement('div');
            customOption.className = 'custom-option';
            customOption.textContent = option.textContent;
            customOption.dataset.value = option.value;
            if (option.selected) customOption.classList.add('is-selected');
            customOption.addEventListener('click', () => {
                trigger.textContent = customOption.textContent;
                originalSelect.value = customOption.dataset.value;
                originalSelect.dispatchEvent(new Event('change'));
                options.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('is-selected'));
                customOption.classList.add('is-selected');
                customSelect.classList.remove('is-open');
            });
            options.appendChild(customOption);
        });

        customSelect.appendChild(trigger);
        customSelect.appendChild(options);
        wrapper.appendChild(customSelect);
        trigger.addEventListener('click', () => customSelect.classList.toggle('is-open'));
        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) customSelect.classList.remove('is-open');
        });
    });
});