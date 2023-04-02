import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

import { fetchImages } from './js/fetchImages';
import { renderGallery } from './js/renderGallery';
import {
  ifImagesFoundAlert,
  ifNoImagesFoundAlert,
  ifEndOfSearchAlert,
  ifNoEmptySearchAlert,
} from './js/alerts';
import { onScroll, OnTopButtonClick } from './js/scrollOnTop';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more-button');
const searchInput = document.querySelector('input[name="searchQuery"]');

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchFormButtonClick);
loadMoreButton.addEventListener('click', renderNextPage);
window.addEventListener('scroll', debounce(infinityScroll, 300));

// function onSearchFormButtonClick(element) {
//   element.preventDefault();
//   window.scrollTo({ top: 0 });
//   page = 1;
//   query = element.currentTarget.searchQuery.value.trim();
//   gallery.innerHTML = '';
//   loadMoreButton.classList.add('visualy-hidden');

//   if (query === '') {
//       ifNoEmptySearchAlert();
      
//     return;
//   } else {
//     fetchImages(query, page, perPage)
//       .then(({ data }) => {
//         if (data.totalHits === 0) {
//             ifNoImagesFoundAlert();
//             searchInput.value = '';
//         } else {
//           renderGallery(data.hits);
//           simpleLightBox = new SimpleLightbox('.gallery a').refresh();
//           console.log(data.hits);

//           ifImagesFoundAlert(data);

         
//         }
//       })
//       .catch(error => console.log(error));
//   }
// }
 async function onSearchFormButtonClick(element) {
  element.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = element.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreButton.classList.add('visualy-hidden');

  if (query === '') {
    ifNoEmptySearchAlert();
    return;
  } else {
    try {
      const { data } = await fetchImages(query, page, perPage);
      if (data.totalHits === 0) {
        ifNoImagesFoundAlert();
        searchInput.value = '';
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        console.log(data.hits);

        ifImagesFoundAlert(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// function renderNextPage() {
//   page += 1;

//   fetchImages(query, page, perPage)
//     .then(({ data }) => {
//       renderGallery(data.hits);
//       simpleLightBox = new SimpleLightbox('.gallery a').refresh();
//       console.log(data.hits);

//       const totalPages = Math.ceil(data.totalHits / perPage);

//       if (page > totalPages) {
//         loadMoreButton.classList.add('visualy-hidden');
//         ifEndOfSearchAlert();
//       }
//     })
//     .catch(error => console.log(error));
// }

async function renderNextPage() {
    page += 1;

    try {
        const { data } = await fetchImages(query, page, perPage);
        
            renderGallery(data.hits);
            simpleLightBox = new SimpleLightbox('.gallery a').refresh();
            console.log(data.hits);

            const totalPages = Math.ceil(data.totalHits / perPage);

            if (page > totalPages) {
                loadMoreButton.classList.add('visualy-hidden');
                ifEndOfSearchAlert();
            }
        }
        catch (error) {
            console.log(error)
        };
    }


async function infinityScroll() {
  const windowHeight = window.innerHeight;
  const galleryPageHeight = gallery.offsetHeight;
  const yOffset = window.pageYOffset;
  const y = yOffset + windowHeight;

  if (y >= galleryPageHeight) {
    page += 1;

      try {
          const { data } = await fetchImages(query, page, perPage);
      
          renderGallery(data.hits);
          simpleLightBox = new SimpleLightbox('.gallery a').refresh();
          console.log(data.hits);

          const totalPages = Math.ceil(data.totalHits / perPage);

          if (page >= totalPages) {
              ifEndOfSearchAlert();
          }
      }
      catch (error) {
          console.log(error)
      };
  }
}