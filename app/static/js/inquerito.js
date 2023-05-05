const namesContainer = document.querySelector('.names-container');
  const selectElement = document.querySelector('#elemt-number');

  function createNameInputs() {
    namesContainer.innerHTML = '';
    const numNames = selectElement.value;
    for (let i = 1; i <= numNames; i++) {
      const label = document.createElement('label');
      label.setAttribute('for', `name${i}`);
      label.classList.add('form-label');
      label.innerText = `Nome ${i}`;

      const inputGroup = document.createElement('div');
      inputGroup.classList.add('d-flex', 'input-group', 'w-100', 'align-items-center');
      inputGroup.setAttribute('id', `labelName${i}`);

      const span = document.createElement('span');
      span.classList.add('input-group-text', 'me-2', 'span-image', 'rounded-circle', 'd-flex', 'align-items-center', 'justify-content-center');
      span.setAttribute('style', 'height: 40px; width: 40px; position: relative');

      const icon = document.createElement('i');
      icon.classList.add('fa-solid', 'fa-user');

      const file = document.createElement('input');
      file.setAttribute('type', 'file');
      file.classList.add('form-control', 'image');
      file.setAttribute('name', `file${i}`);
      file.setAttribute('style', 'height: 100%; width: 100%; position: absolute; opacity: 0');
      file.setAttribute('accept', '.jpg, .png');
      file.addEventListener('change', function() {
        const reader = new FileReader();
        reader.onload = function(event) {
          const image = new Image();
          image.src = event.target.result;
          image.setAttribute('style', 'height: 40px; width: 40px; position: absolute;');
          image.classList.add('rounded-circle','border','border-info');
          span.appendChild(image);
        }
        reader.readAsDataURL(this.files[0]);
      });


      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.classList.add('form-control','me-2');
      input.setAttribute('name', `name${i}`);
      input.setAttribute('id', `name${i}`);
      input.setAttribute('placeholder', `Nome ${i}`);

      // const colorInput = document.createElement('input');
      // colorInput.setAttribute('type', 'color');
      // colorInput.classList.add('form-control', 'color');
      // colorInput.setAttribute('name', `color${i}`);
      // colorInput.setAttribute('id', `color${i}`);
      // colorInput.setAttribute('value', '#000000');
      // colorInput.setAttribute('style', 'width: 30px; height: 40px');

      // Adiciona o input de cor e o input para digitar o nome da cor ou o código RGB ao input-group

      span.appendChild(icon);
      span.appendChild(file);
      inputGroup.appendChild(span);
      inputGroup.appendChild(input);
      // inputGroup.appendChild(colorInput);

      const error = document.createElement('div');
      error.classList.add('error');

      const inputControl = document.createElement('div');
      inputControl.classList.add('input-control', 'w-100');
      inputControl.appendChild(label);
      inputControl.appendChild(inputGroup);
      inputControl.appendChild(error);

      namesContainer.appendChild(inputControl);
    }
  }

  // Adiciona as opções automaticamente usando JavaScript
  for (let i = 2; i <= 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    selectElement.appendChild(option);
  }

  selectElement.addEventListener('change', createNameInputs);

  createNameInputs();