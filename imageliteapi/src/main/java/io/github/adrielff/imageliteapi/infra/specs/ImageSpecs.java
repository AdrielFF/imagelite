package io.github.adrielff.imageliteapi.infra.specs;

import io.github.adrielff.imageliteapi.domain.entity.Image;
import io.github.adrielff.imageliteapi.domain.enums.ImageExtension;
import org.springframework.data.jpa.domain.Specification;

public class ImageSpecs {

    private ImageSpecs(){}

    public static Specification<Image> extensionEqual(ImageExtension extension) {
        return (r, q, cb) ->  cb.equal(r.get("extension"), extension);
    }

    public static Specification<Image> nameLike(String query) {
        return (r, q, cb) -> cb.like(cb.upper(r.get("name")), "%" + query.toUpperCase() + "%");
    }

    public static Specification<Image> tagsLike(String query) {
        return(r, q, cb) -> cb.like(cb.upper(r.get("tags")), "%" + query.toUpperCase() + "%");
    }
}