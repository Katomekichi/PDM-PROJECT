package com.pdm.exception;

/** Thrown when saving/deleting a sub-entity would violate an active DQ rule. */
public class DqRuleViolationException extends RuntimeException {
    public DqRuleViolationException(String message) {
        super(message);
    }
}
