<?php

use Illuminate\Database\Migrations\Migration;

/**
 * Superseded by AppServiceProvider::seedReferenceDataAfterMigrate, which now
 * brings in the reference data a deployment cannot start without: the plans,
 * the template catalogue, and the super admin.
 *
 * Seeding from a migration reached only the databases that had not run this
 * one yet. A migration runs once per database, so everything already deployed
 * kept whatever catalogue it was created with, however many times it was
 * deployed afterwards - which is how Aperture, Forma and Kirki stayed out of
 * production for a week while being present in development.
 *
 * The provider keeps the property that made a migration the right place, that
 * `migrate` is the one hook every pipeline runs, and drops the one that made
 * it the wrong place.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Deliberately empty. The file stays because it is already recorded in
        // the migrations table of every database that has run it.
    }

    public function down(): void
    {
        // Reference data belongs to the tables that hold it; those migrations
        // drop it when they are rolled back. There is nothing to undo here.
    }
};
