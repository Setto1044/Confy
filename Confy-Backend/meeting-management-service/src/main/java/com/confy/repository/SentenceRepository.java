package com.confy.repository;

import com.confy.entity.Sentence;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SentenceRepository extends CrudRepository<Sentence, Integer> {
}
