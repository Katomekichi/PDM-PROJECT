package com.pdm.entity;
import java.util.UUID;
import java.time.Instant;
import jakarta.persistence.*;
import lombok.*;

@Getter @Setter
@Entity
@Table(name="audit_transaction")
public class AuditTransaction {

    @Id
    private UUID id;

    private String entityType;

    private UUID entityId;

    private String parentType;

    private UUID parentId;

    private String operation;

    private String section;

    @Column(columnDefinition = "TEXT")
    private String data;

    private String changedBy;

    private Instant changedAt;

}
