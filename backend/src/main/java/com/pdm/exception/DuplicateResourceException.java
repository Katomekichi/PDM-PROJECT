package com.pdm.exception;

/** Thrown when a uniqueness business rule is violated - e.g. duplicate NPI or Tax ID. */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
