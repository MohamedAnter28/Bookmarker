document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.querySelector('.sub');
  const siteNameInput = document.querySelector('#siteName');
  const siteUrlInput = document.querySelector('#url');
  const searchInput = document.querySelector('.search');
  const websitesTable = document.querySelector('.websites');
  const deletedWebsitesTable = document.querySelector('.Dwebsites');

  const siteNameRegex = /^.{4,}$/;
  const siteUrlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/)?$/;

  const siteNameError = document.querySelector('.site-name .alert');
  const siteUrlError = document.querySelector('.site-url .alert');

  let websites = JSON.parse(localStorage.getItem("websites")) || [];
  let deletedWebsites = JSON.parse(localStorage.getItem("deleted")) || [];

  function validateSiteName() {
      if (!siteNameRegex.test(siteNameInput.value.trim())) {
          siteNameInput.classList.remove('is-valid');
          siteNameInput.classList.add('is-invalid');
          siteNameError.classList.remove('d-none');
          return false;
      } else {
          siteNameInput.classList.remove('is-invalid');
          siteNameInput.classList.add('is-valid');
          siteNameError.classList.add('d-none');
          return true;
      }
  }

  function validateSiteUrl() {
      if (!siteUrlRegex.test(siteUrlInput.value.trim())) {
          siteUrlInput.classList.remove('is-valid');
          siteUrlInput.classList.add('is-invalid');
          siteUrlError.classList.remove('d-none');
          return false;
      } else {
          siteUrlInput.classList.remove('is-invalid');
          siteUrlInput.classList.add('is-valid');
          siteUrlError.classList.add('d-none');
          return true;
      }
  }

  siteNameInput.addEventListener('input', validateSiteName);
  siteUrlInput.addEventListener('input', validateSiteUrl);
  searchInput.addEventListener('input', search);

  function updateIndices() {
      Array.from(websitesTable.children).forEach((row, index) => {
          row.querySelector('td').textContent = index + 1;
      });
  }

  function addWebsite() {
      const siteName = siteNameInput.value.trim();
      const siteUrl = siteUrlInput.value.trim();

      const website = { siteName, siteUrl };
      websites.push(website);
      localStorage.setItem("websites", JSON.stringify(websites));

      siteNameInput.value = '';
      siteUrlInput.value = '';
      siteNameInput.classList.remove('is-valid', 'is-invalid');
      siteNameError.classList.add('d-none');
      siteUrlInput.classList.remove('is-valid', 'is-invalid');
      siteUrlError.classList.add('d-none');

      displayWebsite(website);
  }

  function displayWebsite(website) {
      const row = document.createElement('tr');

      const indexCell = document.createElement('td');
      indexCell.textContent = websitesTable.children.length + 1;

      const nameCell = document.createElement('td');
      nameCell.textContent = website.siteName;

      const linkCell = document.createElement('td');
      const link = document.createElement('a');
      link.textContent = 'View';
      link.setAttribute('href', website.siteUrl);
      link.setAttribute('target', '_blank');
      link.className = 'btn btn-visit';
      linkCell.appendChild(link);

      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'btn btn-delete';
      deleteButton.setAttribute('type', 'button');
      deleteButton.onclick = () => {
          row.remove();
          websites = websites.filter(w => w.siteUrl !== website.siteUrl);
          localStorage.setItem("websites", JSON.stringify(websites));
          deletedWebsites.push(website);
          localStorage.setItem("deleted", JSON.stringify(deletedWebsites));
          updateIndices();
          displayDeletedWebsites();
      };

      deleteCell.appendChild(deleteButton);

      row.appendChild(indexCell);
      row.appendChild(nameCell);
      row.appendChild(linkCell);
      row.appendChild(deleteCell);

      websitesTable.appendChild(row);
  }

  function loadWebsites() {
      websites.forEach(website => {
          displayWebsite(website);
      });
  }

  function displayDeletedWebsites() {
      deletedWebsitesTable.innerHTML = '';
      deletedWebsites.forEach((website, index) => {
          const row = document.createElement('tr');

          const indexCell = document.createElement('td');
          indexCell.textContent = index + 1;

          const nameCell = document.createElement('td');
          nameCell.textContent = website.siteName;

          const linkCell = document.createElement('td');
          const link = document.createElement('a');
          link.textContent = 'View';
          link.setAttribute('href', website.siteUrl);
          link.setAttribute('target', '_blank');
          link.className = 'btn btn-success';
          linkCell.appendChild(link);

          const deleteCell = document.createElement('td');
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.className = 'btn btn-danger';
          deleteButton.setAttribute('type', 'button');
          deleteButton.onclick = () => {
              deletedWebsites.splice(index, 1);
              localStorage.setItem("deleted", JSON.stringify(deletedWebsites));
              displayDeletedWebsites();
          };

          const restoreCell = document.createElement('td');
          const restoreButton = document.createElement('button');
          restoreButton.textContent = 'Restore';
          restoreButton.className = 'btn btn-warning';
          restoreButton.setAttribute('type', 'button');
          restoreButton.onclick = () => {
              websites.push(website);
              localStorage.setItem("websites", JSON.stringify(websites));
              displayWebsite(website);
              deletedWebsites.splice(index, 1);
              localStorage.setItem("deleted", JSON.stringify(deletedWebsites));
              displayDeletedWebsites();
          };

          deleteCell.appendChild(deleteButton);
          restoreCell.appendChild(restoreButton);

          row.appendChild(indexCell);
          row.appendChild(nameCell);
          row.appendChild(linkCell);
          row.appendChild(deleteCell);
          row.appendChild(restoreCell);

          deletedWebsitesTable.appendChild(row);
      });
  }

  function search() {
      const term = searchInput.value.toLowerCase();
      const filteredWebsites = websites.filter(website => website.siteName.toLowerCase().includes(term));
      websitesTable.innerHTML = '';
      filteredWebsites.forEach(website => {
          displayWebsite(website);
      });
  }

  submitButton.addEventListener('click', (e) => {
      if (!validateSiteName() || !validateSiteUrl()) {
          e.preventDefault();
      } else {
          addWebsite();
      }
  });

  document.querySelector('.dw').addEventListener('click', function () {
      document.querySelector('.box').classList.remove('d-none');
  });

  document.querySelector('.times').addEventListener('click', function () {
      document.querySelector('.box').classList.add('d-none');
  });

  loadWebsites();
  displayDeletedWebsites();
});