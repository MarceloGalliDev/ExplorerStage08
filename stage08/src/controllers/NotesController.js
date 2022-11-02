const { request, response } = require("express");
const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
        const { title, description, rating, tags } = request.body;
        const { user_id } = request.params;

        const note_id = await knex("notes").insert({ title, description, rating, user_id });

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        });

        await knex("tags").insert(tagsInsert);

        response.json();
    }

    async show(request, response) {
        const { id } = request.params;

        const note = await knex("notes").where({ id }).first();
        const tags = await knex("tags").where({ note_id: id }).orderBy("name");

        return response.json({
            ...note,
            tags,
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { user_id, title, rating, tags } = request.query;

        let notes;

        if(tags) {
            const filterTags = tags.split(',').map(tag => tag.trim());

            notes = await knex("tags")
                .select([
                    "notes.id",
                    "notes.title",
                    "notes.rating",
                    "notes.user_id",
                ])
                .where("notes.user_id", user_id)
                .whereLike("notes.title", `%${title}%`)
                .whereIn("name", filterTags)
                .innerJoin("notes", "notes.id", "tags.note_id")
                .orderBy("notes.title")

        } else {
            notes = await knex("notes")
                .where({ user_id })
                .whereLike( "title", `%${title}%` )
                .orderBy("title")
        }

        const userTags = await knex("tags"). where({ user_id }); //selecionado somente o conteudo de user_id
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)//realizamos o map para percorrer o array notes, ja fazendo a busca na chave estrangeira de tags que é note_id combinando com id de note

            return {
                ...note,
                tags: noteTags
            }
        })

        return response.json(notesWithTags);
    }

};

module.exports = NotesController;

//where() é para seleção de um id somente
//first() é para seleção da primeira id
//`%${title}%` o uso do % é correspondente para o uso de tudo que contem a palavra será mostrado
//map(tag => tag.trim()) estamos utilizando tag como index e usando trim para eliminar os espaços em branco
//.whereIn("name", filterTags) aqui estamos utilizando o whereIn para filtrar o nome que estiver contido dentro de filterTags
//.innerJoin("notes", "notes.id", "tags.note_id") aqui estamos conectando as tabelas notes e tags, relacionando o campo notes.id com tags.note_id, que no caso eles tem em comum