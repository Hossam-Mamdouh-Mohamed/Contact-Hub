const lstContacts = 'lstContacts';
let contacts = JSON.parse(localStorage.getItem(lstContacts) || '[]');

const nameInput = document.getElementById('contactName');
const emailInput = document.getElementById('contactEmail');
const phoneInput = document.getElementById('contactPhone');
const addressInput = document.getElementById('contactAddress');
const form = document.getElementById('contactForm');
const modalElement = document.getElementById('staticBackdrop');
const contactsContainer = document.getElementById('contacts-container');
const favoritesList = document.getElementById('favorites-list');
const emergencyList = document.getElementById('emergency-list');

const modal = modalElement ? bootstrap.Modal.getOrCreateInstance(modalElement) : null;

document.addEventListener('DOMContentLoaded', () => {
    bindContacts();
});

if (form) {
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const contactIdValue = document.getElementById('contactId')?.value || '';
    const newContact = {
        name: nameInput?.value.trim() || '',
        email: emailInput?.value.trim() || '',
        phone: phoneInput?.value.trim() || '',
        address: addressInput?.value.trim() || '',
        favorite: document.getElementById('contactFavorite')?.checked || false,
        emergency: document.getElementById('contactEmergency')?.checked || false
    };

    if (contactIdValue) {
        const index = contacts.findIndex(c => c.id === contactIdValue);
        if (index !== -1) {
            contacts[index] = { ...contacts[index], ...newContact };
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Contact updated successfully.",
                timer: 1500,
                showConfirmButton: false
            });
        }
    } else {

        contacts.push({ id: Date.now().toString(), ...newContact });
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Contact added successfully.",
            timer: 1500,
            showConfirmButton: false
        });
    }

    resetForm();
    localStorage.setItem(lstContacts, JSON.stringify(contacts));
    bindContacts();

    if (modal) {
        modal.hide();
    }
}

function validateForm() {
    let isValid = true;

    const nameValue = nameInput?.value.trim() || '';
    const emailValue = emailInput?.value.trim() || '';
    const phoneValue = phoneInput?.value.trim() || '';
    const addressValue = addressInput?.value.trim() || '';

    const nameRegex = /^[\p{L}\s]{2,50}$/u;
    const phoneRegex = /^01[0125]\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(nameValue)) {
        isValid = false;
        showError('contactNameError', true);
    } else {
        showError('contactNameError', false);
    }

    if (!phoneRegex.test(phoneValue)) {
        isValid = false;
        showError('contactPhoneError', true);
    } else {
        showError('contactPhoneError', false);
    }

    if (emailValue && !emailRegex.test(emailValue)) {
        isValid = false;
        showError('contactEmailError', true);
    } else {
        showError('contactEmailError', false);
    }

    if (addressValue && addressValue.length < 3) {
        isValid = false;
        showError('contactAddressError', true);
    } else {
        showError('contactAddressError', false);
    }

    return isValid;
}

function showError(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('d-none', !show);
    }
}


function resetForm() {
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    addressInput.value = '';
    document.getElementById('contactFavorite').checked = false;
    document.getElementById('contactEmergency').checked = false;
    document.getElementById('contactId').value = '';
}

function bindContacts() {
    const totalContactsElement = document.getElementById('total-contacts');
    if (totalContactsElement) {
        totalContactsElement.textContent = contacts.length.toString();
    }

    const totalFavoritesElement = document.getElementById('total-favorites');
    if (totalFavoritesElement) {
        const totalFavorites = contacts.filter(contact => contact.favorite).length;
        totalFavoritesElement.textContent = totalFavorites.toString();
    }

    const totalEmergencyElement = document.getElementById('total-emergency');
    if (totalEmergencyElement) {
        const totalEmergency = contacts.filter(contact => contact.emergency).length;
        totalEmergencyElement.textContent = totalEmergency.toString();
    }

    renderSidebarLists();

    if (!contactsContainer) return;

    if (contacts.length === 0) {
        contactsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info mb-0">No contacts yet. Add your first contact to get started.</div>
            </div>`;
        return;
    }

    let contactsHTML = '';
    contacts.forEach(contact => {
        const favoriteBadge = contact.favorite ? '<span class="badge bg-warning text-dark me-2">Favorite</span>' : '';
        const emergencyBadge = contact.emergency ? '<span class="badge bg-danger text-white">Emergency</span>' : '';
        let contactName = (contact.name).split(' ').map(word => word.charAt(0).toUpperCase()).join('');
        contactsHTML += `
            <div class="col-md-6">
                <div class="contact-card mb-3 bg-white shadow-sm">
                    <div class="contact-header d-flex align-items-center gap-3 p-3">
                        <div class="icon d-flex justify-content-center align-items-center position-relative">
                            <span class="">${contactName}</span>
                            ${contact.favorite ? '<i class="favorite fa-solid fa-star fs-6"></i>' : ''}
                            ${contact.emergency ? '<i class="emergency fa-solid fa-heart-pulse fs-6"></i>' : ''}
                        </div>
                        <div class="person-info">
                            <h3 class="mb-1">${contact.name || 'Unnamed Contact'}</h3>
                            <p class="mb-0"><i class="fa fa-phone me-2"></i><span class="phone-number">${contact.phone || 'No phone'}</span></p>
                        </div>
                    </div>

                    <div class="contact-body p-3">
                        ${contact.email ? `
                            <div class="d-flex gap-3 mb-2">
                                <div class="mail-info d-flex justify-content-center align-items-center">
                                    <i class="fa fa-envelope"></i>
                                </div>
                                <span class="person-mail">${contact.email}</span>
                            </div>` : ''}

                        ${contact.address ? `
                            <div class="d-flex gap-3">
                                <div class="address-info d-flex justify-content-center align-items-center">
                                    <i class="fa fa-location-dot"></i>
                                </div>
                                <span class="person-address">${contact.address}</span>
                            </div>` : ''}

                        <div class="category mt-3">
                            ${favoriteBadge}${emergencyBadge}
                        </div>
                    </div>

                    <div class="contact-footer py-2">
                        <div class="actions-container d-flex justify-content-between p-3">
                            <div class="actions">
                                <button class="phone-btn" onclick="callContact('${contact.phone || ''}')"><i class="fa fa-phone"></i></button>
                                <button class="email-btn" onclick="sendEmail('${contact.email || ''}')"><i class="fa fa-envelope"></i></button>
                            </div>
                            <div class="actions">
                                <button class="star-btn" onclick="toggleStar('${contact.id}')"><i class="${contact.favorite ? 'fa-solid fa-star' : 'fa-regular fa-star'}"></i></button>
                                <button class="favorite-btn" onclick="toggleFavorite('${contact.id}')"><i class="${contact.emergency ? 'fa-solid fa-heart-pulse' : 'fa-regular fa-heart'}"></i></button>
                                <button class="edit-btn" onclick="editContact('${contact.id}')"><i class="fa fa-pen"></i></button>
                                <button class="delete-btn" onclick="deleteContact('${contact.id}')"><i class="fa fa-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    contactsContainer.innerHTML = contactsHTML;
}

function renderSidebarLists() {
    const favoriteContacts = contacts.filter(contact => contact.favorite);
    const emergencyContacts = contacts.filter(contact => contact.emergency);

    if (favoritesList) {
        favoritesList.innerHTML = favoriteContacts.length
            ? favoriteContacts.map(contact => `
                <div class="contact-card my-3 bg-white shadow-sm p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-2">
                            <div class="icon">
                              <span class="">${(contact.name).split(' ').map(word => word.charAt(0).toUpperCase()).join('')}</span>
                            </div>
                            <div>
                            <h6 class="mb-1">${contact.name || 'Unnamed Contact'}</h6>
                            <p class="mb-0 small text-muted">${contact.phone || 'No phone'}</p>
                        </div>
                            </div>
                        <button class="phone-btn" onclick="callContact('${contact.phone || ''}')"><i class="fa fa-phone"></i></button>
                    </div>
                </div>`).join('')
            : '<p class="text-muted small mb-0">No favorite contacts yet.</p>';
    }

    if (emergencyList) {
        emergencyList.innerHTML = emergencyContacts.length
            ? emergencyContacts.map(contact => `
                <div class="contact-card my-3 bg-white shadow-sm p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-2">
                            <div class="icon">
                              <span class="">${(contact.name || 'U').split(' ').map(word => word.charAt(0).toUpperCase()).join('')}</span>
                            </div>
                            <div>
                                <h6 class="mb-1">${contact.name || 'Unnamed Contact'}</h6>
                                <p class="mb-0 small text-muted">${contact.phone || 'No phone'}</p>
                            </div>
                        </div>
                        <button class="phone-btn" onclick="callContact('${contact.phone || ''}')"><i class="fa fa-phone"></i></button>
                    </div>
                </div>`).join('')
            : '<p class="text-muted small mb-0">No emergency contacts yet.</p>';
    }
}

function callContact(phone) {
    if (phone) {
        window.location.href = `tel:${phone}`;
    }
}

function sendEmail(email) {
    if (email) {
        window.location.href = `mailto:${email}`;
    }
}

function toggleStar(id) {
    const contact = contacts.find(item => item.id === id);
    if (contact) {
        contact.favorite = !contact.favorite;
        localStorage.setItem(lstContacts, JSON.stringify(contacts));
        bindContacts();
    }
}

function toggleFavorite(id) {
    const contact = contacts.find(item => item.id === id);
    if (contact) {
        contact.emergency = !contact.emergency;
        localStorage.setItem(lstContacts, JSON.stringify(contacts));
        bindContacts();
    }
}

function editContact(id) {
    const contact = contacts.find(item => item.id === id);
    if (!contact) return;
    let modeTitle = document.getElementById('staticBackdropLabel');
    modeTitle.textContent = 'Edit Contact';
    document.getElementById('contactName').value = contact.name || '';
    document.getElementById('contactEmail').value = contact.email || '';
    document.getElementById('contactPhone').value = contact.phone || '';
    document.getElementById('contactAddress').value = contact.address || '';
    document.getElementById('contactFavorite').checked = !!contact.favorite;
    document.getElementById('contactEmergency').checked = !!contact.emergency;
    document.getElementById('contactId').value = contact.id;

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('staticBackdrop'));
    modal.show();
}

function deleteContact(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to recover this contact!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {

            // Delete the contact here
            contacts = contacts.filter(contact => contact.id !== id);

            localStorage.setItem("lstContacts", JSON.stringify(contacts));

            displayContacts();

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "The contact has been deleted.",
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}


document.getElementById('searchInput')?.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    if (!searchTerm) {
        contacts = JSON.parse(localStorage.getItem(lstContacts) || '[]');
        bindContacts();
        return;
    }
    const filteredContacts = contacts.filter(contact => {
        return contact.name.toLowerCase().includes(searchTerm) ||
               contact.email.toLowerCase().includes(searchTerm) ||
               contact.phone.includes(searchTerm);
    });
    contacts=filteredContacts;
    bindContacts();
});