const express = require('express');
const db = require('./userDb')
const posts = require('../posts/postDb')

const router = express.Router();



router.post('/', validateUser, (req, res) => {
  const name  = req.body;

  db.insert( name )
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        errorMessage: "No user added", error })
    })
});

//-----------------------//

router.get('/', (req, res) => {
  db.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(error => {
    res.status(500).json({
      success: false, 
      errorMessage: "Unable to pull from Data base", error})
  })
});


//-----------------------//
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

//-----------------------//

router.get('/:id/posts', validateUserId, (req, res) => {

  db.getUserPosts(req.user.id)
  .then(posts => {
    if (posts.length > 0) {
      res.status(200).json(posts);
    }
  })
  .catch(error => {
    res.status(500).json({ 
      success: false,
      errorMessage: "No posts retrieved", error
    });
  });

});
//-----------------------//

router.delete('/:id', validateUserId, (req, res) => {
 
  db.remove(req.user.id)
  .then(() => {
    res.status(200).json({ 
      success: true,
      message: `user with id ${req.user.id} was deleted` 
    });
  })
  .catch(error => {
    res.status(500).json({ 
      success: false,
      errorMessage: "Couldn't delete the user", error
     });
  });
});


//-----------------------//
router.put('/:id', (req, res) => {

  db.update(req.params.id, req.body)
  .then(() => {
    db.getById(req.params.id)
      .then(user => {
        res.status(200).json(user);
      })
  })
  .catch(error => {
    res.status(500).json({
      success: false, 
      errorMessage: "Could not retrieve update user", error 
    });
  });
});

//-----------------------//
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  posts.insert ({user_id: req.params.id, text: req.body.text})
  .then(post => {
    res.status(200).json({ 
      success: true,
      message: post 
    });
  })
  .catch(error => {
    res.status(500).json({ 
      success: false, 
      errorMessage: "Could not post", error
     });
  });
});

//custom Validate Middleware//

//ValidateUserId//
//-----------------------//

function validateUserId(req, res, next) {
  db.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      }
      else {
        res.status(500).json({ 
          errorMessage: "No user with this ID exists" 
        });
      };
    })
    .catch(error => {
      res.status(500).json({ 
        errorMessage: "Id required", error
      });
    });
};


//-----------------------//
//ValidateUser//
//-----------------------//

function validateUser(req, res, next) {

  const text = req.body.name;

  if (!req.body.name) {
    return res.status(404).json({ 
      success: false,
      errorMessage: "missing user data" 
    });

  } else {
    req.user = text;
    next();
  };
};


//-----------------------//
//ValidatePost//
//-----------------------//

function validatePost(req, res, next) {
  const post = (
    req.body.text,
    req.params.id
  );

  if (!req.body.text) {
    return res.status(404).json({ 
      success: false,
      errorMessage: "missing post data" 
    });

  } else {
    req.text = post;
    next();
  };

};
module.exports = router;