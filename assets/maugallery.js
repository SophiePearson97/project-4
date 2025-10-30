(function ($) {
  $.fn.mauGallery = function (opts) {
    const settings = $.extend({}, $.fn.mauGallery.defaults, opts);
    const tagsCollection = [];

    return this.each(function () {
      const $gallery = $(this);

      $.fn.mauGallery.methods.createRowWrapper($gallery);

      if (settings.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $gallery,
          settings.lightboxId,
          settings.navigation
        );
      }

      $.fn.mauGallery.listeners(settings);

      $gallery
        .children(".gallery-item")
        .each(function () {
          const $item = $(this);
          $.fn.mauGallery.methods.responsiveImageItem($item);
          $.fn.mauGallery.methods.moveItemInRowWrapper($item);
          $.fn.mauGallery.methods.wrapItemInColumn($item, settings.columns);

          const theTag = $item.data("gallery-tag");
          if (
            settings.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (settings.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $gallery,
          settings.tagsPosition,
          tagsCollection
        );
      }

      $gallery.fadeIn(500);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,     // defaults to "galleryLightbox" if null
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  $.fn.mauGallery.listeners = function (options) {
    $(".gallery-item").on("click", function () {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };

  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },

    wrapItemInColumn(element, columns) {
      if (columns && columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns && columns.constructor === Object) {
        let columnClasses = "";
        if (columns.xs) columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        if (columns.sm) columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        if (columns.md) columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        if (columns.lg) columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        if (columns.xl) columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },

    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },

    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },

    openLightBox(element, lightboxId) {
      const id = lightboxId || "galleryLightbox";
      $(`#${id}`).find(".lightboxImage").attr("src", element.attr("src"));
      $(`#${id}`).modal("toggle");
    },

    prevImage() {
      let activeImage = null;
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });

      const activeTag =
        $(".tags-bar .active-tag").data("images-toggle") || "all";

      const imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function () {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function () {
          const $img = $(this).children("img");
          if ($img.data("gallery-tag") === activeTag) {
            imagesCollection.push($img);
          }
        });
      }

      if (!imagesCollection.length) return;

      let currentIndex = 0;
      $(imagesCollection).each(function (i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) currentIndex = i;
      });

      const prevIndex =
        (currentIndex - 1 + imagesCollection.length) % imagesCollection.length;

      $(".lightboxImage").attr("src", $(imagesCollection[prevIndex]).attr("src"));
    },

    nextImage() {
      let activeImage = null;
      $("img.gallery-item").each(function () {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });

      const activeTag =
        $(".tags-bar .active-tag").data("images-toggle") || "all";

      const imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function () {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function () {
          const $img = $(this).children("img");
          if ($img.data("gallery-tag") === activeTag) {
            imagesCollection.push($img);
          }
        });
      }

      if (!imagesCollection.length) return;

      let currentIndex = 0;
      $(imagesCollection).each(function (i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) currentIndex = i;
      });

      const nextIndex = (currentIndex + 1) % imagesCollection.length;

      $(".lightboxImage").attr("src", $(imagesCollection[nextIndex]).attr("src"));
    },

    createLightBox(gallery, lightboxId, navigation) {
      const idAttr = lightboxId ? lightboxId : "galleryLightbox";
      gallery.append(
        `<div class="modal fade" id="${idAttr}" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-body" style="position:relative;">
                ${
                  navigation
                    ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                    : '<span style="display:none;"></span>'
                }
                <img class="lightboxImage img-fluid" alt="Image ouverte dans la visionneuse"/>
                ${
                  navigation
                    ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
                    : '<span style="display:none;"></span>'
                }
              </div>
            </div>
          </div>
        </div>`
      );
    },

    showItemTags(gallery, position, tags) {
      let tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
      $.each(tags, function (index, value) {
        tagItems += `<li class="nav-item">
          <span class="nav-link" data-images-toggle="${value}">${value}</span>
        </li>`;
      });
      const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },

    filterByTag() {
      if ($(this).hasClass("active-tag")) return;

      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active active-tag");

      const tag = $(this).data("images-toggle");

      $(".gallery-item").each(function () {
        const $col = $(this).parents(".item-column");
        $col.hide();
        if (tag === "all" || $(this).data("gallery-tag") === tag) {
          $col.show(300);
        }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const upgrade = () => {
      document.querySelectorAll('.tags-bar .nav-link').forEach(el => {
        if (el.tagName !== 'BUTTON') {
          const btn = document.createElement('button');
          btn.className = el.className;
          btn.type = 'button';
          btn.setAttribute('data-images-toggle', el.getAttribute('data-images-toggle'));
          btn.innerHTML = el.innerHTML;
          el.replaceWith(btn);
        }
      });
    };

    const observer = new MutationObserver(upgrade);
    observer.observe(gallery, { childList: true, subtree: true });
  });

})(jQuery);