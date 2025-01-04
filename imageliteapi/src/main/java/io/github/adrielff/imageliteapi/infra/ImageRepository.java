package io.github.adrielff.imageliteapi.infra;

import io.github.adrielff.imageliteapi.domain.entity.Image;
import io.github.adrielff.imageliteapi.domain.enums.ImageExtension;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

import static io.github.adrielff.imageliteapi.infra.specs.GenericSpecs.conjuction;
import static io.github.adrielff.imageliteapi.infra.specs.ImageSpecs.*;
import static org.springframework.data.jpa.domain.Specification.anyOf;
import static org.springframework.data.jpa.domain.Specification.where;

public interface ImageRepository extends JpaRepository<Image, UUID>, JpaSpecificationExecutor<Image> {

    default List<Image> findByExtensionAndNameOrTagsLike(ImageExtension extension, String query) {
        Specification<Image> specs = where(conjuction());

        if(extension != null) {
            specs = specs.and(extensionEqual(extension));
        }

        if(StringUtils.hasText(query)) {
            specs = specs.and(anyOf(nameLike(query), tagsLike(query)));
        }

        return findAll(specs);
    }
}
