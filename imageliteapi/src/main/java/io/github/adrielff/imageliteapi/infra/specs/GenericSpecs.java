package io.github.adrielff.imageliteapi.infra.specs;

import io.github.adrielff.imageliteapi.domain.entity.Image;
import org.springframework.data.jpa.domain.Specification;

public class GenericSpecs {

    private GenericSpecs(){};

    public static <T> Specification<T> conjuction() {
        return (r, q, cb) -> cb.conjunction();
    }
}
